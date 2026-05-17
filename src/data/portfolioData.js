import { Icons } from "../components/Icons";
import logoDos from "../assets/logoDos.png";

// ─────────────────────────────────────────────────────────────────
//  CÓMO AGREGAR TUS ARCHIVOS
// ─────────────────────────────────────────────────────────────────
//
//  IMÁGENES / VIDEOS LOCALES:
//    1. Copia el archivo a:  public/images/foto.jpg
//                            public/videos/video.mp4
//    2. Úsalo como src:      "/images/foto.jpg"
//                            "/videos/video.mp4"
//
//  GOOGLE DRIVE:
//    1. Abre el archivo → Compartir → "Cualquiera con el enlace"
//    2. Del enlace copia solo el ID:
//       https://drive.google.com/file/d/ ESTE_ES_EL_ID /view
//    - Para imágenes: src: "https://drive.google.com/thumbnail?id=ID&sz=w800"
//    - Para videos:   type: "drive",  src: "SOLO_EL_ID"
//
//  YOUTUBE:
//    type: "youtube",  src: "https://www.youtube.com/watch?v=XXXX"
//
// ─────────────────────────────────────────────────────────────────

export const kpis = [
  { label: "Instituciones impactadas", value: "12+",     icon: Icons.School },
  { label: "Estudiantes estimados",    value: "250-300", icon: Icons.Users  },
  { label: "Actividades académicas",   value: "15+",     icon: Icons.Play   },
  { label: "Productos y desarrollos",  value: "6+",      icon: Icons.Layers },
];

export const years = [
  {
    year: "2022",
    title: "El inicio del camino investigativo",
    emotion: "Curiosidad",
    story: "La participación en encuentros de semilleros abrió el camino para empezar a construir una trayectoria investigativa.",
    highlights: ["Primer póster", "Inicio del semillero", "Divulgación académica"],
    image: logoDos,
  },
  {
    year: "2023",
    title: "La tecnología llegó a los colegios",
    emotion: "Compartir conocimiento",
    story: "Las capacitaciones de realidad aumentada permitieron llevar herramientas tecnológicas a estudiantes de colegios.",
    highlights: ["Comfaboy", "Simón Bolívar", "Guillermo León Valencia", "UPTC"],
    image: null,
  },
  {
    year: "2024",
    title: "La investigación se volvió propuesta",
    emotion: "Crecimiento",
    story: "Aparecen NeuroInfo, ponencias, pósteres, eventos académicos y la integración entre neurociencia y realidad aumentada.",
    highlights: ["CyberTech Women UNAD", "NeuroInfo", "ENIIU", "Colegio Boyacá"],
    image: null,
  },
  {
    year: "2025",
    title: "Consolidación e impacto real",
    emotion: "Transformación",
    story: "El semillero consolida capacitaciones, aplicaciones, gamificación, RA, IA y desarrollo de soluciones tecnológicas.",
    highlights: ["Chiquinquirá", "Turmequé", "Villa de Leyva", "Alto Chicamocha RA"],
    image: null,
  },
  {
    year: "2026",
    title: "Memoria, resultados y legado",
    emotion: "Gratitud",
    story: "El informe final recoge una experiencia que fortaleció investigación, liderazgo, comunicación y desarrollo tecnológico.",
    highlights: ["Informe final", "Revisión sistemática", "Portafolio interactivo"],
    image: null,
  },
];

// ─── Eventos por año ───────────────────────────────────────────────
export const eventsByYear = {
  "2022": [
    {
      id: "2022-1", type: "Investigación", title: "Inicio del semillero TECSI", date: "2022",
      description: "Formación oficial del semillero de investigación, definiendo las líneas de trabajo en tecnología educativa, RA e IA.",
      highlights: ["Semillero fundado", "Líneas de investigación", "Primer equipo"],
      image: null, media: [],
    },
    {
      id: "2022-2", type: "Ponencia", title: "Primer póster académico", date: "2022",
      description: "Presentación del primer póster en encuentro de semilleros. Primer paso en la trayectoria investigativa del grupo.",
      highlights: ["Primer póster", "Inicio del semillero", "Divulgación académica"],
      image: null, media: [],
    },
  ],
  "2023": [
    {
      id: "2023-1", type: "Capacitación", title: "Taller RA — Comfaboy", date: "2023",
      description: "Capacitación de realidad aumentada dirigida a estudiantes de Comfaboy. Primera experiencia de transferencia tecnológica a instituciones externas.",
      highlights: ["Comfaboy", "RA educativa", "Estudiantes secundaria"],
      image: null, media: [
        { type: "image", src: null, caption: "Taller Comfaboy" },
        { type: "video", src: null, caption: "Video actividad" },
      ],
    },
    {
      id: "2023-2", type: "Capacitación", title: "Taller RA — Simón Bolívar", date: "2023",
      description: "Capacitación en herramientas de realidad aumentada para estudiantes del colegio Simón Bolívar.",
      highlights: ["Simón Bolívar", "Herramientas RA", "Impacto escolar"],
      image: null, media: [{ type: "image", src: null, caption: "Estudiantes Simón Bolívar" }],
    },
    {
      id: "2023-3", type: "Capacitación", title: "Taller RA — Guillermo León Valencia", date: "2023",
      description: "Actividad práctica de realidad aumentada con estudiantes del colegio Guillermo León Valencia.",
      highlights: ["Guillermo León Valencia", "Práctica RA"],
      image: null, media: [],
    },
    {
      id: "2023-4", type: "Capacitación", title: "Taller RA — UPTC", date: "2023",
      description: "Sesión de capacitación en la Universidad Pedagógica y Tecnológica de Colombia, integrando RA en contextos universitarios.",
      highlights: ["UPTC", "Contexto universitario", "RA aplicada"],
      image: null, media: [{ type: "image", src: null, caption: "Actividad UPTC" }],
    },
  ],
  "2024": [
    {
      id: "2024-1", type: "Ponencia", title: "CyberTech Women — UNAD", date: "2024",
      description: "Presentación de NeuroInfo en el evento CyberTech Women de la UNAD. Primer reconocimiento externo del proyecto.",
      highlights: ["CyberTech Women", "UNAD", "NeuroInfo"],
      image: null, media: [
        { type: "youtube", src: null, caption: "Video CyberTech" },
        { type: "image",   src: null, caption: "Presentación" },
      ],
    },
    {
      id: "2024-2", type: "Producto", title: "NeuroInfo", date: "2024",
      description: "Propuesta de aplicación móvil que une neurociencia, realidad aumentada y aprendizaje interactivo. Fue presentada en múltiples eventos académicos.",
      highlights: ["App móvil", "Neurociencia + RA", "Aprendizaje interactivo"],
      image: null, media: [
        { type: "youtube", src: null, caption: "Demo NeuroInfo" },
        { type: "image",   src: null, caption: "Pantallas de la app" },
        { type: "image",   src: null, caption: "Póster ENIIU" },
      ],
    },
    {
      id: "2024-3", type: "Ponencia", title: "ENIIU 2024", date: "2024",
      description: "Participación en el Encuentro Nacional de Investigación e Innovación Universitaria con póster y presentación oral.",
      highlights: ["ENIIU", "Investigación", "Póster académico"],
      image: null, media: [{ type: "image", src: null, caption: "Póster ENIIU" }],
    },
    {
      id: "2024-4", type: "Capacitación", title: "Taller RA — Colegio Boyacá", date: "2024",
      description: "Capacitación de realidad aumentada con estudiantes de grado 11 del Colegio Boyacá.",
      highlights: ["Colegio Boyacá", "Grado 11", "RA aplicada"],
      image: null, media: [{ type: "image", src: null, caption: "Estudiantes Colegio Boyacá" }],
    },
  ],
  "2025": [
    {
      id: "2025-1", type: "Capacitación", title: "Taller RA + IA — Chiquinquirá", date: "2025",
      description: "Capacitación de realidad aumentada e inteligencia artificial en Chiquinquirá. Primera integración formal de IA en los talleres.",
      highlights: ["Chiquinquirá", "RA + IA", "Nuevo formato"],
      image: null, media: [
        { type: "video", src: null, caption: "Video capacitación" },
        { type: "image", src: null, caption: "Actividad con estudiantes" },
      ],
    },
    {
      id: "2025-2", type: "Capacitación", title: "VI Feria Universitaria — Turmequé", date: "2025",
      description: "Participación en la VI Feria Universitaria de Turmequé con demostración de aplicaciones de RA y gamificación.",
      highlights: ["Turmequé", "Feria universitaria", "Gamificación"],
      image: null, media: [{ type: "image", src: null, caption: "Feria Turmequé" }],
    },
    {
      id: "2025-3", type: "Capacitación", title: "Taller RA — Villa de Leyva", date: "2025",
      description: "Capacitación dirigida a estudiantes de grado 10 en Villa de Leyva, incorporando experiencias inmersivas con RA.",
      highlights: ["Villa de Leyva", "Grado 10", "Experiencias inmersivas"],
      image: null, media: [{ type: "image", src: null, caption: "Taller Villa de Leyva" }],
    },
    {
      id: "2025-4", type: "Producto", title: "Alto Chicamocha RA", date: "2025",
      description: "Aplicación móvil funcional para comprender sistemas de energías renovables mediante realidad aumentada y gamificación.",
      highlights: ["App móvil", "Energías renovables", "Gamificación", "RA"],
      image: null, media: [
        { type: "video", src: "/videos/videoJuego.mp4", caption: "Demo Alto Chicamocha" },
        { type: "image",   src: null, caption: "Interfaz de la app" },
        { type: "image",   src: null, caption: "Interfaz de la app" },
      ],
    },
  ],
  "2026": [
    {
      id: "2026-1", type: "Investigación", title: "Revisión sistemática — RA e IA en veterinaria", date: "2026",
      description: "Artículo de revisión sistemática sobre el potencial de RA e IA para el aprendizaje interactivo en educación veterinaria.",
      highlights: ["Artículo académico", "Revisión sistemática", "Medicina veterinaria"],
      image: null, media: [{ type: "image", src: null, caption: "Portada del artículo" }],
    },
    {
      id: "2026-2", type: "Producto", title: "Portafolio interactivo TECSI", date: "2026",
      description: "Desarrollo del portafolio interactivo del semillero: una experiencia web accesible por QR que recoge toda la trayectoria investigativa.",
      highlights: ["Portafolio web", "QR interactivo", "Legado del semillero"],
      image: null, media: [],
    },
  ],
};

export const mapPoints = [
  { name: "Tunja",          note: "Universidad, Comfaboy, UPTC y eventos", x: "50%", y: "42%" },
  { name: "Villa de Leyva", note: "Capacitación grado 10",                 x: "66%", y: "28%" },
  { name: "Turmequé",       note: "VI Feria Universitaria",                x: "38%", y: "52%" },
  { name: "Chiquinquirá",   note: "Capacitación RA + IA",                  x: "25%", y: "38%" },
  { name: "Colegio Boyacá", note: "Capacitación grado 11",                 x: "62%", y: "60%" },
  { name: "San Jerónimo",   note: "Codirección trabajos de grado",         x: "74%", y: "48%" },
];

export const activityCounts = [
  { label: "Capacitaciones", value: 8 },
  { label: "Ponencias",      value: 5 },
  { label: "Pósteres",       value: 4 },
  { label: "Desarrollos",    value: 3 },
  { label: "Investigaciones",value: 2 },
];

export const workItems = [
  {
    category: "Capacitación",
    title: "Realidad Aumentada e IA en colegios",
    place: "Chiquinquirá, Turmequé, Villa de Leyva, Colegio Boyacá, Comfaboy y otros",
    result: "Acercamiento de estudiantes a herramientas emergentes mediante experiencias prácticas.",
    media: [
      { type: "video", src: null, caption: "Video capacitación Chiquinquirá" },
      { type: "image", src: null, caption: "Taller Comfaboy" },
      { type: "image", src: null, caption: "Taller Villa de Leyva" },
      { type: "video", src: null, caption: "Video Turmequé" },
    ],
  },
  {
    category: "Investigación",
    title: "RA e IA en educación veterinaria",
    place: "Artículo de revisión sistemática",
    result: "Análisis del potencial de RA e IA para aprendizaje interactivo en medicina veterinaria.",
    media: [
      { type: "image", src: null, caption: "Portada artículo" },
      { type: "image", src: null, caption: "Póster presentado" },
      { type: "video", src: null, caption: "Sustentación" },
      { type: "image", src: null, caption: "Equipo de investigación" },
    ],
  },
  {
    category: "Producto",
    title: "NeuroInfo",
    place: "CyberTech Women UNAD / ENIIU",
    result: "Propuesta de aplicación móvil que une neurociencia, realidad aumentada y aprendizaje interactivo.",
    media: [
      { type: "youtube", src: null, caption: "Demo NeuroInfo" },
      { type: "image",   src: null, caption: "Pantallas de la app" },
      { type: "image",   src: null, caption: "Póster ENIIU" },
      { type: "image",   src: null, caption: "Presentación CyberTech" },
    ],
  },
  {
    category: "Producto",
    title: "Alto Chicamocha RA",
    place: "Energías renovables + gamificación",
    result: "Aplicaciones móviles funcionales para comprender sistemas energéticos con recursos inmersivos.",
    media: [
      { type: "video", src: "/videos/videoJuego.mp4", caption: "Demo Alto Chicamocha" },
      { type: "video", src: "/videos/videoJuego.mp4", caption: "Interfaz gamificación" },
      { type: "image",   src: null, caption: "Estudiantes usando la app" },
      { type: "image",   src: null, caption: "Póster presentado" },
    ],
  },
];