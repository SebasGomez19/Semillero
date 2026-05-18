import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export default function ARModal({ isOpen, onClose, modelUrl = "/models/avatarJulis.fbx" }) {
    const mountRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const rendererRef = useRef(null);
    const animFrameRef = useRef(null);
    const sceneRef = useRef(null);
    const mixerRef = useRef(null);
    const clockRef = useRef(null);

    const cleanup = useCallback(() => {
        cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (rendererRef.current) {
            if (rendererRef.current.domElement.parentNode === mountRef.current) {
                mountRef.current?.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current.dispose();
            rendererRef.current = null;
        }
        sceneRef.current = null;
        mixerRef.current = null;
    }, []);

    useEffect(() => {
        if (!isOpen) { cleanup(); return; }

        let cancelled = false;

        async function init() {
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
            } catch {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                } catch (err) {
                    console.error("No se pudo acceder a la cámara:", err);
                    return;
                }
            }

            if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(() => { });
            }

            if (cancelled || !mountRef.current) return;

            await new Promise((r) => setTimeout(r, 100)); // espera que el modal renderice
            if (cancelled || !mountRef.current) return;
            const w = mountRef.current.clientWidth || window.innerWidth;
            const h = mountRef.current.clientHeight || window.innerHeight;

            const scene = new THREE.Scene();
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000);
            camera.position.set(0, 50, 180);

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            mountRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            scene.add(new THREE.AmbientLight(0xffffff, 1.2));
            const dir = new THREE.DirectionalLight(0x22d3ee, 2.5);
            dir.position.set(5, 10, 7);
            scene.add(dir);
            const fill = new THREE.DirectionalLight(0xffffff, 0.8);
            fill.position.set(-5, -5, -5);
            scene.add(fill);

            const loader = new FBXLoader();
            loader.load(
                modelUrl,
                (object) => {
                    if (cancelled) return;
                    const box = new THREE.Box3().setFromObject(object);
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 150 / maxDim;
                    object.scale.setScalar(scale);
                    const box2 = new THREE.Box3().setFromObject(object); // recalcular tras escalar
                    const center = box2.getCenter(new THREE.Vector3());
                    object.position.set(-center.x, -center.y, -center.z); // centrar exacto en 0,0,0
                    // Quitar objetos esféricos o con nombre específico
                    object.traverse((child) => {
                        if (child.isMesh) {
                            const name = child.name.toLowerCase();
                            // Elimina si el nombre contiene "sphere", "geo", "esfera" o similar
                            if (
                                name.includes("sphere") ||
                                name.includes("geo") ||
                                name.includes("esfera") ||
                                name.includes("ball") ||
                                name.includes("globe")
                            ) {
                                child.visible = false;
                            }
                        }
                    });


                    scene.add(object);
                    if (object.animations?.length) {
                        const mixer = new THREE.AnimationMixer(object);
                        mixerRef.current = mixer;
                        mixer.clipAction(object.animations[0]).play();
                    }
                },
                undefined,
                (err) => console.error("Error cargando FBX:", err)
            );

            const clock = new THREE.Clock();
            clockRef.current = clock;

            function animate() {
                animFrameRef.current = requestAnimationFrame(animate);
                const delta = clock.getDelta();
                mixerRef.current?.update(delta);
                scene.rotation.y += 0.004;
                scene.position.y = Math.sin(Date.now() * 0.0015) * 3;
                renderer.render(scene, camera);
            }
            animate();

            const onResize = () => {
                if (!mountRef.current || !rendererRef.current) return;
                const nw = mountRef.current.clientWidth;
                const nh = mountRef.current.clientHeight;
                camera.aspect = nw / nh;
                camera.updateProjectionMatrix();
                rendererRef.current.setSize(nw, nh);
            };
            window.addEventListener("resize", onResize);
            return () => window.removeEventListener("resize", onResize);
        }

        init();
        return () => { cancelled = true; cleanup(); };
    }, [isOpen, modelUrl, cleanup]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", damping: 22, stiffness: 260 }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-black shadow-[0_0_80px_rgba(34,211,238,.25)]"
                        style={{ aspectRatio: "16/9", maxHeight: "90vh", width: "95vw" }}
                    >
                        <video
                            ref={videoRef}
                            className="absolute inset-0 h-full w-full object-cover"
                            playsInline
                            muted
                            autoPlay
                        />

                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        <div
                            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-cyan-400/60"
                            style={{ boxShadow: "0 0 20px rgba(34,211,238,0.8)", animation: "scanline 3s linear infinite" }}
                        />

                        {[
                            { pos: "top-4 left-4", s: { borderTop: "2px solid rgba(34,211,238,0.8)", borderLeft: "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "top-4 right-4", s: { borderTop: "2px solid rgba(34,211,238,0.8)", borderRight: "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "bottom-4 left-4", s: { borderBottom: "2px solid rgba(34,211,238,0.8)", borderLeft: "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "bottom-4 right-4", s: { borderBottom: "2px solid rgba(34,211,238,0.8)", borderRight: "2px solid rgba(34,211,238,0.8)" } },
                        ].map(({ pos, s }, i) => (
                            <div key={i} className={`pointer-events-none absolute ${pos} h-6 w-6`} style={s} />
                        ))}

                        <div ref={mountRef} className="absolute inset-0" style={{ pointerEvents: "none" }} />

                        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/50 px-3 py-1 backdrop-blur-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                            <span className="text-xs font-mono text-cyan-300">AR LIVE</span>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-white/10"
                            aria-label="Cerrar AR"
                        >
                            ✕
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/30 bg-black/50 px-4 py-1.5 backdrop-blur-sm">
                            <span className="text-xs font-mono text-cyan-200">TECSI · Semillero de Investigación</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <style>{`
        @keyframes scanline {
          0%    { top: 0%;   opacity: 1; }
          45%   { opacity: 1; }
          50%   { top: 100%; opacity: 0; }
          50.1% { top: 0%;   opacity: 0; }
          55%   { opacity: 1; }
          100%  { top: 100%; opacity: 1; }
        }
      `}</style>
        </AnimatePresence>
    );
}