import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

// ─── CACHÉ GLOBAL ─────────────────────────────────────────────────────────────
const modelCache = new Map();
let preloadPromise = null;

function getLoader() {
    const loader = new FBXLoader();
    loader.setResourcePath("/models/");
    return loader;
}

function loadFBXCached(url) {
    if (modelCache.has(url)) {
        return Promise.resolve(modelCache.get(url).clone(true));
    }
    if (!preloadPromise) {
        preloadPromise = new Promise((resolve, reject) => {
            getLoader().load(
                url,
                (obj) => {
                    modelCache.set(url, obj);
                    preloadPromise = null;
                    resolve(obj.clone(true));
                },
                undefined,
                (err) => {
                    preloadPromise = null;
                    reject(err);
                }
            );
        });
    }
    return preloadPromise.then((obj) => obj.clone(true));
}

// Llamá esto en el padre apenas monta: useEffect(() => { preloadARModel(); }, []);
export function preloadARModel(url = "/models/avatarJulis.fbx") {
    loadFBXCached(url).catch(() => {});
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function ARModal({
    isOpen,
    onClose,
    modelUrl = "/models/avatarJulis.fbx",
}) {
    const mountRef   = useRef(null);
    const videoRef   = useRef(null);
    const streamRef  = useRef(null);
    const rendererRef = useRef(null);
    const animFrameRef = useRef(null);
    const sceneRef   = useRef(null);
    const mixerRef   = useRef(null);
    const clockRef   = useRef(null);
    const zoomRef    = useRef(1);
    const rotRef     = useRef(0);
    const dragRef    = useRef(null);

    const [loadState, setLoadState] = useState("idle"); // idle | camera | model | ready

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
        sceneRef.current  = null;
        mixerRef.current  = null;
        setLoadState("idle");
    }, []);

    useEffect(() => {
        if (!isOpen) { cleanup(); return; }

        let cancelled = false;
        setLoadState("camera");

        async function init() {
            // ── 1. CÁMARA ────────────────────────────────────────────────────
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 1600 }, height: { ideal: 1000 } },
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
                await videoRef.current.play().catch(() => {});
            }

            // FIX: evento real del video en vez de setTimeout(100)
            await new Promise((r) => {
                if (!videoRef.current) return r();
                if (videoRef.current.readyState >= 2) return r();
                videoRef.current.addEventListener("canplay", r, { once: true });
                setTimeout(r, 1500); // fallback
            });

            if (cancelled || !mountRef.current) return;

            // ── 2. THREE.JS ──────────────────────────────────────────────────
            const w = mountRef.current.clientWidth  || window.innerWidth;
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

            // ── 3. MODELO (desde caché si ya se precargó) ───────────────────
            setLoadState("model");

            let object;
            try {
                object = await loadFBXCached(modelUrl);
            } catch (err) {
                console.error("Error cargando FBX:", err);
                return;
            }

            if (cancelled) return;

            // Escalar y centrar
            const box    = new THREE.Box3().setFromObject(object);
            const size   = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale  = 150 / maxDim;
            object.scale.setScalar(scale);
            const box2   = new THREE.Box3().setFromObject(object);
            const center = box2.getCenter(new THREE.Vector3());
            object.position.set(-center.x, -center.y - 30, -center.z);

            // Ocultar objetos esféricos
            object.traverse((child) => {
                if (child.isMesh) {
                    const name = child.name.toLowerCase();
                    if (
                        name.includes("sphere") ||
                        name.includes("geo")    ||
                        name.includes("esfera") ||
                        name.includes("ball")   ||
                        name.includes("globe")
                    ) {
                        child.visible = false;
                    }
                }
            });

            scene.add(object);

            if (object.animations?.length) {
                const mixer    = new THREE.AnimationMixer(object);
                mixerRef.current = mixer;
                const sequence = [1, 2];
                let current    = 0;

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
                playNext();
            }

            setLoadState("ready");

            // ── 4. LOOP DE ANIMACIÓN ─────────────────────────────────────────
            const clock = new THREE.Clock();
            clockRef.current = clock;

            function animate() {
                animFrameRef.current = requestAnimationFrame(animate);
                const delta = clock.getDelta();
                mixerRef.current?.update(delta);
                scene.rotation.y  = rotRef.current;
                scene.position.y  = Math.sin(Date.now() * 0.0015) * 3;
                scene.scale.setScalar(zoomRef.current);
                renderer.render(scene, camera);
            }
            animate();

            // ── 5. CONTROLES ─────────────────────────────────────────────────
            const el = mountRef.current;
            let lastDist = null;

            function onTouchStart(e) {
                if (e.touches.length === 1)
                    dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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
                    const dx   = e.touches[0].clientX - e.touches[1].clientX;
                    const dy   = e.touches[0].clientY - e.touches[1].clientY;
                    const dist = Math.hypot(dx, dy);
                    zoomRef.current = Math.min(3, Math.max(0.3, zoomRef.current * (dist / lastDist)));
                    lastDist = dist;
                }
            }
            function onTouchEnd()  { dragRef.current = null; lastDist = null; }
            function onMouseDown(e){ dragRef.current = { x: e.clientX }; }
            function onMouseMove(e){
                if (!dragRef.current) return;
                rotRef.current += (e.clientX - dragRef.current.x) * 0.01;
                dragRef.current = { x: e.clientX };
            }
            function onMouseUp()   { dragRef.current = null; }
            function onWheel(e)    {
                e.preventDefault();
                zoomRef.current = Math.min(3, Math.max(0.3, zoomRef.current - e.deltaY * 0.001));
            }
            function onResize() {
                if (!mountRef.current || !rendererRef.current) return;
                const nw = mountRef.current.clientWidth;
                const nh = mountRef.current.clientHeight;
                camera.aspect = nw / nh;
                camera.updateProjectionMatrix();
                rendererRef.current.setSize(nw, nh);
            }

            el.addEventListener("touchstart", onTouchStart, { passive: false });
            el.addEventListener("touchmove",  onTouchMove,  { passive: false });
            el.addEventListener("touchend",   onTouchEnd);
            el.addEventListener("mousedown",  onMouseDown);
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup",   onMouseUp);
            el.addEventListener("wheel", onWheel, { passive: false });
            window.addEventListener("resize", onResize);

            // FIX: ahora sí se ejecuta el cleanup de eventos
            return () => {
                el.removeEventListener("touchstart", onTouchStart);
                el.removeEventListener("touchmove",  onTouchMove);
                el.removeEventListener("touchend",   onTouchEnd);
                el.removeEventListener("mousedown",  onMouseDown);
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup",   onMouseUp);
                el.removeEventListener("wheel", onWheel);
                window.removeEventListener("resize", onResize);
            };
        }

        let eventCleanup;
        init().then((fn) => { if (fn) eventCleanup = fn; });

        return () => {
            cancelled = true;
            eventCleanup?.();
            cleanup();
        };
    }, [isOpen, modelUrl, cleanup]);

    // ── JSX ───────────────────────────────────────────────────────────────────
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
                            { pos: "top-4 left-4",    s: { borderTop:    "2px solid rgba(34,211,238,0.8)", borderLeft:  "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "top-4 right-4",   s: { borderTop:    "2px solid rgba(34,211,238,0.8)", borderRight: "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "bottom-4 left-4", s: { borderBottom: "2px solid rgba(34,211,238,0.8)", borderLeft:  "2px solid rgba(34,211,238,0.8)" } },
                            { pos: "bottom-4 right-4",s: { borderBottom: "2px solid rgba(34,211,238,0.8)", borderRight: "2px solid rgba(34,211,238,0.8)" } },
                        ].map(({ pos, s }, i) => (
                            <div key={i} className={`pointer-events-none absolute ${pos} h-6 w-6`} style={s} />
                        ))}

                        {/* Canvas Three.js */}
                        <div
                            ref={mountRef}
                            className="absolute inset-0 bottom-12"
                            style={{ pointerEvents: "auto", cursor: loadState === "ready" ? "grab" : "default" }}
                        />

                        {/* ── OVERLAY DE CARGA ── */}
                        <AnimatePresence>
                            {loadState !== "ready" && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-[2px]"
                                >
                                    <div className="relative h-14 w-14">
                                        <div
                                            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400"
                                            style={{ animationDuration: "0.9s" }}
                                        />
                                        <div
                                            className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-cyan-300/50"
                                            style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                                        </div>
                                    </div>

                                    <p className="font-mono text-xs text-cyan-300 tracking-widest uppercase">
                                        {loadState === "camera" && "Iniciando cámara…"}
                                        {loadState === "model"  && (modelCache.has(modelUrl) ? "Cargando modelo…" : "Descargando modelo…")}
                                    </p>

                                    <div className="w-32 h-[2px] rounded-full bg-white/10 overflow-hidden">
                                        <div
                                            className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                                            style={{ width: loadState === "camera" ? "30%" : "75%" }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Badge AR LIVE */}
                        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/50 px-3 py-1 backdrop-blur-sm">
                            <span className={`h-2 w-2 rounded-full ${loadState === "ready" ? "animate-pulse bg-cyan-400" : "bg-cyan-400/30"}`} />
                            <span className="text-xs font-mono text-cyan-300">
                                {loadState === "ready" ? "AR LIVE" : "AR INIT"}
                            </span>
                        </div>

                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-white/10"
                            aria-label="Cerrar AR"
                        >
                            ✕
                        </button>

                        {/* Label inferior — texto original tuyo conservado */}
                        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-cyan-400/30 bg-black/50 px-4 py-1.5 backdrop-blur-sm">
                            <span className="text-xs font-mono text-cyan-300">Ing Juliana Corredor Lopez</span>
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