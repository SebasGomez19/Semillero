import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import ImpactMap from "./components/ImpactMap";
import Charts from "./components/Charts";
import WorkCarousel from "./components/WorkCarousel";
import Header from "./components/Header";
import { kpis } from "./data/portfolioData";
import { SectionTitle, StatCard } from "./components/ui";
import {
  Search,
  Code2,
  Presentation,
  Trophy,
  BarChart3,
} from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-cyan-300 selection:text-slate-950">
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-600 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-pink-500 blur-3xl" />
      </div>

      <Header />
      <main className="pt-17">
        <Hero />
        <section className="relative mx-auto max-w-7xl px-6 py-10">
          <SectionTitle eyebrow="Metodología" title="Desarrollo del trabajo realizado">
            Este proceso nos permitió desarrollar experiencias educativas basadas en RA e IA a través de un ciclo iterativo de investigación, diseño, aplicación, divulgación y evaluación.
          </SectionTitle>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              {
                title: "Investigación y revisión",
                text: "Búsqueda y análisis de información, estudio de tecnologías emergentes e identificación de aplicaciones educativas.",
                icon: Search,
              },
              {
                title: "Diseño y desarrollo",
                text: "Creación de propuestas tecnológicas, desarrollo de aplicaciones web y móviles, uso de realidad aumentada, IA y gamificación.",
                icon: Code2,
              },
              {
                title: "Aplicación formativa",
                text: "Capacitaciones en instituciones educativas, talleres prácticos e interactivos y uso de herramientas tecnológicas en contextos reales.",
                icon: Presentation,
              },
              {
                title: "Divulgación académica",
                text: "Ponencias, posters y participación en eventos de investigación.",
                icon: Trophy,
              },
              {
                title: "Evaluación del impacto",
                text: "Análisis de aprendizajes obtenidos, fortalecimiento de competencias técnicas e investigativas y reconocimiento del aporte educativo y social del semillero.",
                icon: BarChart3,
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="flex min-h-[250px] flex-col items-center justify-center rounded-3xl border border-cyan-300/20 bg-white/10 p-5 text-center text-white shadow-xl backdrop-blur-lg"
                >
                  <Icon className="mb-4 h-14 w-14 text-cyan-200" strokeWidth={2.5} />

                  <h3 className="mb-3 text-xl font-black leading-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-white/90">{step.text}</p>
                </div>
              );
            })}
          </div>
        </section>
        <Timeline />

        <section className="relative mx-auto max-w-7xl px-6 py-10">
          <SectionTitle eyebrow="Resumen del informe" title="El trabajo en cifras">
            Estas cifras resumen la magnitud del proceso vivido en el semillero.
          </SectionTitle>

          <div className="grid gap-4 md:grid-cols-4">
            {kpis.map((item, index) => (
              <StatCard key={item.label} item={item} index={index} />
            ))}
          </div>
        </section>




        <section className="relative mx-auto max-w-7xl px-6 py-16">
          <SectionTitle eyebrow="Impacto" title="Resultado educativo de RA e IA">
            Estas tecnologías permitieron transformar la forma de presentar, comprender y participar en procesos de aprendizaje.
          </SectionTitle>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Mayor motivación estudiantil",
              "Aprendizaje interactivo",
              "Apropiación tecnológica",
              "Trabajo colaborativo",
              "Innovación educativa",
              "Divulgación científica",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5"
              >
                <p className="font-bold text-white">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-cyan-400/20 to-violet-600/20 p-8 text-center backdrop-blur-xl">
            <h2 className="text-4xl font-black text-white md:text-6xl">
              Esto no fue solo tecnología.
            </h2>
            <p className="mt-4 text-2xl font-bold text-cyan-100">
              Fue transformación educativa.
            </p>
            <p className="mx-auto mt-6 max-w-3xl text-slate-300">
              El semillero representó años de investigación, esfuerzo, enseñanza,
              desarrollo, pasión y crecimiento profesional.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}