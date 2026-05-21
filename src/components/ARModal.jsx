import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

// Caché de modelos fuera del componente — persiste entre renders y reaperturas
export const modelCache = new Map();

export default function ARModal({ isOpen, onClose, modelUrl = "/models/avatarJulis.fbx" }) {
    const mountRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const rendererRef = useRef(null);
    const animFrameRef = useRef(null);
    const sceneRef = useRef(null);
    const mixerRef = useRef(null);
    const clockRef = useRef(null);
    const zoomRef = useRef(1); // zoom actual
    const rotRef = useRef(0); // rotación Y acumulada
    const dragRef = useRef(null); // estado de arrastre

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
                    video: { facingMode: "environment", width: { ideal: 1600}, height: { ideal: 1000 } },
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

            await new Promise((r) => setTimeout(r, 100));
            if (cancelled || !mountRef.current) return;

            const w = mountRef.current.clientWidth || window.innerWidth;
            const h = mountRef.current.clientHeight || window.innerHeight;

            const scene = new THREE.Scene();
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000);
            camera.position.set(0, 0, 180);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            mountRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Iluminación
            scene.add(new THREE.AmbientLight(0xffffff, 4));
            const front = new THREE.DirectionalLight(0xffffff, 3);
            front.position.set(0, 0, 10);
            scene.add(front);
            const top = new THREE.DirectionalLight(0xffffff, 2);
            top.position.set(0, 10, 0);
            scene.add(top);
            const left = new THREE.DirectionalLight(0x22d3ee, 1.5);
            left.position.set(-10, 5, 5);
            scene.add(left);
            const back = new THREE.DirectionalLight(0xffffff, 1);
            back.position.set(0, 0, -10);
            scene.add(back);

            // ── CARGA CON CACHÉ ──────────────────────────────────────────
            function addObjectToScene(source) {
                // Clonamos para que cada apertura tenga su propia instancia
                const object = source.clone(true);

                // clone() no copia las animaciones — las copiamos manualmente
                object.animations = source.animations;

                // Escalar y centrar
                const box = new THREE.Box3().setFromObject(object);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 150 / maxDim;
                object.scale.setScalar(scale);
                const box2 = new THREE.Box3().setFromObject(object);
                const center = box2.getCenter(new THREE.Vector3());
                object.position.set(-center.x, -center.y - 30, -center.z);

                // Ocultar objetos esféricos
                object.traverse((child) => {
                    if (child.isMesh) {
                        const name = child.name.toLowerCase();
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

                    // Define el orden de animaciones que quieres
                    const sequence = [1, 2]; // índices: "saludar|baile", "saludar|dances", "hello"

                    let current = 0;

                    function playNext() {
                        mixer.stopAllAction();
                        const action = mixer.clipAction(object.animations[sequence[current]]);
                        action.reset();
                        action.setLoop(THREE.LoopOnce, 1);
                        action.clampWhenFinished = true;
                        action.play();
                        current = (current + 1) % sequence.length;
                    }

                    mixer.addEventListener("finished", playNext);
                    playNext(); // arranca la primera
                }
            }

            if (modelCache.has(modelUrl)) {
                // Modelo ya cargado anteriormente: uso instantáneo sin red
                addObjectToScene(modelCache.get(modelUrl));
            } else {
                // Primera apertura: descargamos y guardamos en caché
                const loader = new FBXLoader();
                loader.setResourcePath("/models/");
                loader.load(
                    modelUrl,
                    (object) => {
                        if (cancelled) return;
                        modelCache.set(modelUrl, object); // guardar original en caché
                        addObjectToScene(object);
                    },
                    undefined,
                    (err) => console.error("Error cargando FBX:", err)
                );
            }
            // ─────────────────────────────────────────────────────────────

            const clock = new THREE.Clock();
            clockRef.current = clock;

            function animate() {
                animFrameRef.current = requestAnimationFrame(animate);
                const delta = clock.getDelta();
                mixerRef.current?.update(delta);
                scene.rotation.y = rotRef.current;
                scene.position.y = Math.sin(Date.now() * 0.0015) * 3;
                scene.scale.setScalar(zoomRef.current);
                renderer.render(scene, camera);
            }
            animate();
            const el = mountRef.current;

            // ── TOUCH ────────────────────────────────
            let lastDist = null;

            function onTouchStart(e) {
                if (e.touches.length === 1) {
                    dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
                if (e.touches.length === 2) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    lastDist = Math.hypot(dx, dy);
                }
            }
            function onTouchMove(e) {
                e.preventDefault();
                if (e.touches.length === 1 && dragRef.current) {
                    const dx = e.touches[0].clientX - dragRef.current.x;
                    rotRef.current += dx * 0.01;
                    dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
                if (e.touches.length === 2 && lastDist !== null) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const dist = Math.hypot(dx, dy);
                    zoomRef.current = Math.min(3, Math.max(0.3, zoomRef.current * (dist / lastDist)));
                    lastDist = dist;
                }
            }
            function onTouchEnd() {
                dragRef.current = null;
                lastDist = null;
            }
            // ── MOUSE (desktop) ──────────────────────
            function onMouseDown(e) {
                dragRef.current = { x: e.clientX };
            }
            function onMouseMove(e) {
                if (!dragRef.current) return;
                rotRef.current += (e.clientX - dragRef.current.x) * 0.01;
                dragRef.current = { x: e.clientX };
            }
            function onMouseUp() { dragRef.current = null; }
            function onWheel(e) {
                e.preventDefault();
                zoomRef.current = Math.min(3, Math.max(0.3, zoomRef.current - e.deltaY * 0.001));
            }
            el.addEventListener("touchstart", onTouchStart, { passive: false });
            el.addEventListener("touchmove", onTouchMove, { passive: false });
            el.addEventListener("touchend", onTouchEnd);
            el.addEventListener("mousedown", onMouseDown);
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            el.addEventListener("wheel", onWheel, { passive: false });
            return () => {
                el.removeEventListener("touchstart", onTouchStart);
                el.removeEventListener("touchmove", onTouchMove);
                el.removeEventListener("touchend", onTouchEnd);
                el.removeEventListener("mousedown", onMouseDown);
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
                el.removeEventListener("wheel", onWheel);
            }

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
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", damping: 22, stiffness: 260 }}
                        className="relative w-full max-w-2xl h-full overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-black shadow-[0_0_80px_rgba(34,211,238,.25)]"
                        style={{ aspectRatio: "16/9", maxHeight: "150vh", width: "95vw" }}
                    >
                        {/* Feed de cámara */}
                        <video
                            ref={videoRef}
                            className="absolute inset-0 h-full w-full object-cover"
                            playsInline
                            muted
                            autoPlay
                        />

                        {/* Grid HUD */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        {/* Scan line */}
                        <div
                            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-cyan-400/60"
                            style={{ boxShadow: "0 0 20px rgba(34,211,238,0.8)", animation: "scanline 3s linear infinite" }}
                        />

                        {/* Esquinas HUD */}
                        {[
                            { pos: "top-4 left-4", s: { borderTop: "2px solid rgba(34,211,238,0.8)", borderLeft: "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "top-4 right-4", s: { borderTop: "2px solid rgba(34,211,238,0.8)", borderRight: "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "bottom-4 left-4", s: { borderBottom: "2px solid rgba(34,211,238,0.8)", borderLeft: "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "bottom-4 right-4", s: { borderBottom: "2px solid rgba(34,211,238,0.8)", borderRight: "2px solid rgba(34,211,238,0.8)" } },
                        ].map(({ pos, s }, i) => (
                            <div key={i} className={`pointer-events-none absolute ${pos} h-6 w-6`} style={s} />
                        ))}

                        {/* Canvas Three.js */}
                        <div ref={mountRef} className="absolute inset-0 bottom-12" style={{ pointerEvents: "auto", cursor: "grab" }} />

                        {/* Badge AR LIVE */}
                        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/50 px-3 py-1 backdrop-blur-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                            <span className="text-xs font-mono text-cyan-300">AR LIVE</span>
                        </div>

                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-white/10"
                            aria-label="Cerrar AR"
                        >
                            ✕
                        </button>

                        {/* Label inferior */}
                        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-0.7 rounded-full border border-cyan-400/30 bg-black/50 px-4 py-1.5 backdrop-blur-sm">
                            <span className="text-xs font-mono text-cyan-450">Ing Juliana Corredor Lopez</span>
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