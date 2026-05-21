import logoDos from "../assets/logoDos.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icons } from "./Icons";
import { Badge, Button, Card, CardContent } from "./ui";
import ARModal from "./ARModal";

export default function Hero() {
  const [scanActive, setScanActive] = useState(false);
  const [arOpen, setArOpen] = useState(false);

  return (
    <section className="ar-grid relative mx-auto min-h-screen max-w-7xl overflow-hidden px-6 py-10 lg:py-16">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.14),transparent_60%)]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <div className="relative z-10 grid min-h-[85vh] items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <Badge className="mb-5 bg-cyan-500/20 text-cyan-200">
            <Icons.Sparkles className="mr-2 h-4 w-4" />
            Portafolio de actividades de semillero
          </Badge>

          <h3 className="title-glow max-w-4xl text-xl font-black leading-tight tracking-tight md:text-5xl">
            Desarrollo e investigación de tecnologías basadas en realidad
            aumentada e inteligencia artificial enfocado a la educación
          </h3>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#recorrido">
              <Button className="rounded-2xl bg-cyan-400 px-6 py-3 text-slate-950 hover:bg-cyan-300">
                Iniciar recorrido <Icons.Chevron className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <h1 className="title-glow max-w-4xl text-center text-xl font-black leading-tight tracking-tight md:text-5xl">
              Presiona el avatar para vivir una experiencia inmersiva de RA
            </h1>
          </div>
        </div>

        {/* Wrapper que permite que el badge flote fuera del Card */}
        <div className="relative mt-6">

          {/* Badge flotante FUERA del overflow-hidden */}
          <motion.span
            className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-900 shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ✦ Ver en Realidad Aumentada
          </motion.span>

          <Card className="relative overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-slate-900/80 shadow-[0_0_70px_rgba(34,211,238,.18)] backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-cyan-300/30 bg-slate-950">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] bg-[size:32px_32px]" />

                <motion.div
                  className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-300/60"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                />

                <motion.div
                  className="absolute left-8 right-8 top-8 h-1 rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(34,211,238,1)]"
                  animate={{ y: scanActive ? [0, 260, 0] : [0, 230, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    onHoverStart={() => setScanActive(true)}
                    onHoverEnd={() => setScanActive(false)}
                    onClick={() => setArOpen(true)}
                    className="relative rounded-3xl border border-white/60 bg-white/30 text-center backdrop-blur-md"
                  >
                    <img
                      src="/images/juliing.png"
                      alt="Abrir experiencia de Realidad Aumentada"
                      className="mx-auto mb-4 h-70 w-50 object-contain"
                    />
                    <p className="pb-2 text-xs font-semibold text-cyan-300 animate-pulse">
                      👆 Toca para explorar
                    </p>
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ARModal
        isOpen={arOpen}
        onClose={() => setArOpen(false)}
        modelUrl="/models/avatarJulis.fbx"
      />
    </section>
  );
}