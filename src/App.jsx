import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import ImpactMap from "./components/ImpactMap";
import Charts from "./components/Charts";
import WorkCarousel from "./components/WorkCarousel";
import Header from "./components/Header";
import { kpis } from "./data/portfolioData";
import { SectionTitle, StatCard } from "./components/ui";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-cyan-300 selection:text-slate-950">
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-600 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-pink-500 blur-3xl" />
      </div>

      <Header />
      <Hero />
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
      <Charts />

      <section className="relative mx-auto max-w-7xl px-6 py-16">
        <SectionTitle eyebrow="Metodología" title="Cómo se desarrolló el trabajo">
          El proceso del semillero se puede explicar como una ruta de investigación formativa, desarrollo tecnológico y aplicación educativa.
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-5">
          {["Investigación", "Diseño", "Desarrollo", "Aplicación", "Evaluación"].map(
            (step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 backdrop-blur-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 font-black text-slate-950">
                  {index + 1}
                </div>
                <h3 className="font-black text-white">{step}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Fase del proceso de investigación, creación y validación de experiencias educativas.
                </p>
              </div>
            )
          )}
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
    </div>
  );
}