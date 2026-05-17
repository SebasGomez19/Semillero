import logoDos from "../assets/logoDos.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icons } from "./Icons";
import { Badge, Button, Card, CardContent } from "./ui";

export default function Hero() {
  const [scanActive, setScanActive] = useState(false);

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
            Portafolio interactivo del semillero
          </Badge>

          <h1 className="title-glow max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            TECSI: tecnología, investigación y educación
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Una página tipo presentación interactiva para que el público escanee un QR y recorra desde su celular los años de capacitaciones, ponencias, proyectos e investigación.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#recorrido">
              <Button className="rounded-2xl bg-cyan-400 px-6 py-3 text-slate-950 hover:bg-cyan-300">
                Iniciar recorrido <Icons.Chevron className="ml-2 h-4 w-4" />
              </Button>
            </a>

            <a href="#evidencias">
              <Button className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-white hover:bg-white/10">
                Ver evidencias <Icons.Play className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

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
                className="absolute left-8 right-8 top-8 h-1 rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(34,211,238,.9)]"
                animate={{ y: scanActive ? [0, 260, 0] : [0, 230, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />

              <div className="absolute inset-0 flex items-center justify-center p-8">
                <motion.button
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  onHoverStart={() => setScanActive(true)}
                  onHoverEnd={() => setScanActive(false)}
                  onTap={() => setScanActive((v) => !v)}
                  className="rounded-3xl border border-white/20 bg-white/10 p-7 text-center backdrop-blur-md"
                >
                  <img
                    src={logoDos}
                    alt="Portal RA"
                    className="mx-auto mb-4 h-50 w-50 object-contain"
                  />
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}