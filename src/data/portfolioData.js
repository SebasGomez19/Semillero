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

// ─── Eventos por categoría ─────────────────────────────────────────────
export const eventsByCategory = {

  "Póster": [
    {
      id: "poster-1", type: "Póster", title: "I Encuentro de Semilleros", date: "2022",
      description: "Presentación del primer póster en el I Encuentro de Semilleros. Primer paso en la trayectoria investigativa del grupo.",
      
      image: null, media: [],
    },
    {
      id: "poster-2", type: "Póster", title: "CyberTech Women", date: "2024",
      description: "Presentación de póster en el evento CyberTech Women 2024.",
     
      image: null, media: [
        { type: "youtube", src: "https://youtu.be/756tzAlCJrM", caption: "Póster CyberTech Women 2024" },
      ],
    },
    {
      id: "poster-3", type: "Póster", title: "CHICAMOCHA V — Encuentro de Semilleros", date: "2025",
      description: "Participación con póster en el V Encuentro de Semilleros de Investigación de la Facultad de Ingeniería y Ciencias Básicas.",
      
      image: null, media: [
        { type: "image", src: null, caption: "Póster CHICAMOCHA V 2025" },
      ],
    },
    {
      id: "poster-4", type: "Póster", title: "CyberTech Women", date: "2026",
      description: "Presentación de póster en el evento CyberTech Women 2026.",
    
      image: null, media: [
        { type: "image", src: null, caption: "Póster CyberTech Women 2026" },
      ],
    },
  ],

  "Capacitaciones": [
    {
      id: "cap-1", type: "Capacitación", title: "Taller RA — Colegio Libertador Simón Bolívar", date: "2023",
      description: "Capacitación en herramientas de realidad aumentada para estudiantes del Colegio Libertador Simón Bolívar.",

      image: null, media: [{ type: "image", src: null, caption: "Estudiantes Simón Bolívar" }],
    },
    {
      id: "cap-2", type: "Capacitación", title: "Taller RA — Comfaboy", date: "2023",
      description: "Capacitación de realidad aumentada dirigida a estudiantes de Comfaboy. Primera experiencia de transferencia tecnológica a instituciones externas.",
  
      image: null, media: [
        { type: "image", src: null, caption: "Taller Comfaboy" },
        { type: "video", src: null, caption: "Video actividad" },
      ],
    },
    {
      id: "cap-3", type: "Capacitación", title: "Taller RA — Guillermo León Valencia", date: "2023",
      description: "Actividad práctica de realidad aumentada con estudiantes del colegio Guillermo León Valencia.",

      image: null, media: [],
    },
    {
      id: "cap-4", type: "Capacitación", title: "Taller RA — Instituto Técnico Gonzalo Suárez Rendón", date: "2024",
      description: "Capacitación de realidad aumentada en el Instituto Técnico Gonzalo Suárez Rendón.",

      image: null, media: [{ type: "image", src: null, caption: "Actividad ITGSR" }],
    },
    {
      id: "cap-5", type: "Capacitación", title: "Taller RA — Colegio Boyacá", date: "2024",
      description: "Capacitación de realidad aumentada con estudiantes del Colegio Boyacá.",

      image: null, media: [{ type: "image", src: null, caption: "Estudiantes Colegio Boyacá" }],
    },
    {
      id: "cap-6", type: "Capacitación", title: "Taller RA — Colegio Villa de Leyva", date: "2025",
      description: "Capacitación dirigida a estudiantes en Villa de Leyva, incorporando experiencias inmersivas con RA.",

      image: null, media: [{ type: "image", src: null, caption: "Taller Villa de Leyva" }],
    },
    {
      id: "cap-7", type: "Capacitación", title: "Taller RA — Colegio Diego Torres Turmequé", date: "2025",
      description: "Capacitación con estudiantes del Colegio Diego Torres en Turmequé.",

      image: null, media: [{ type: "image", src: null, caption: "Taller Turmequé" }],
    },
    {
      id: "cap-8", type: "Capacitación", title: "Taller RA + IA — Colegio Chiquinquirá", date: "2025",
      description: "Primera integración formal de inteligencia artificial en los talleres de realidad aumentada, en Chiquinquirá.",

      image: logoDos, media: [
        { type: "video", src: logoDos, caption: "Video capacitación" },
        { type: "image", src: logoDos, caption: "Actividad con estudiantes" },
      ],
    },
  ],

  "Participaciones / Ponencias": [
    {
      id: "pon-1", type: "Ponencia", title: "Tercer Simposio Tejiendo Humanidad", date: "2023",
      description: "Participación en el Tercer Simposio Tejiendo Humanidad con presentación de avances del semillero.",

      image: null, media: [],
    },
    {
      id: "pon-2", type: "Ponencia", title: "ENIIU — Encuentro Nacional de Investigación", date: "2024",
      description: "Participación en el Encuentro Nacional de Investigación e Innovación Universitaria con póster y presentación oral.",

      image: null, media: [{ type: "image", src: null, caption: "Póster ENIIU" }],
    },
    {
      id: "pon-3", type: "Ponencia", title: "CyberTech Women — UNAD", date: "2024",
      description: "Presentación de NeuroInfo en el evento CyberTech Women de la UNAD. Primer reconocimiento externo del proyecto.",

      image: null, media: [
        { type: "youtube", src: null, caption: "Video CyberTech" },
        { type: "image",   src: null, caption: "Presentación" },
      ],
    },
    {
      id: "pon-4", type: "Ponencia", title: "Metodologías activas — RA para actividad física y deporte", date: "2025",
      description: "Ponencia sobre el uso de la realidad aumentada en metodologías activas en educación física y deportes.",

      image: null, media: [],
    },
  ],

  "Investigaciones": [
    {
      id: "inv-1", type: "Investigación", title: "NeuroInfo", date: "2024",
      description: "Propuesta de aplicación móvil que une neurociencia, realidad aumentada y aprendizaje interactivo. Presentada en múltiples eventos académicos.",

      image: null, media: [
        { type: "youtube", src: null, caption: "Demo NeuroInfo" },
        { type: "image",   src: null, caption: "Pantallas de la app" },
        { type: "image",   src: null, caption: "Póster ENIIU" },
      ],
    },
    {
      id: "inv-2", type: "Investigación", title: "Revisión sistemática — RA e IA en educación veterinaria", date: "2026",
      description: "Artículo de revisión sistemática sobre el potencial de la RA e IA para el aprendizaje interactivo en educación veterinaria.",

      image: null, media: [{ type: "image", src: null, caption: "Portada del artículo" }],
    },
  ],

  "Codirección": [
    {
      id: "codir-1", type: "Codirección", title: "Co-directora de trabajos de grado — San Jerónimo Emiliani", date: "2024",
      description: "Co-directora de trabajos de grado en modalidades técnicas de la institución San Jerónimo Emiliani.",

      image: null, media: [],
    },
  ],

  "Talleres": [
    {
      id: "taller-1", type: "Taller", title: "Evento eSports — Taller RA y RV", date: "2025",
      description: "Participación en evento de eSports con taller de realidad aumentada y realidad virtual.",

      image: null, media: [
        { type: "video", src: null, caption: "Video taller eSports" },
        { type: "image", src: null, caption: "Actividad RA y RV" },
      ],
    },
  ],

  "Participaciones": [
    {
      id: "part-1", type: "Participación", title: "Charla — Introducción a la Ingeniería de Sistemas", date: "2023",
      description: "Charla introductoria sobre Ingeniería de Sistemas dirigida a estudiantes interesados en la carrera.",

      image: null, media: [],
    },
    {
      id: "part-2", type: "Participación", title: "Aplicación RA — Inauguración Doctorado en TI", date: "2025",
      description: "Demostración de aplicación de realidad aumentada en la inauguración del Doctorado en Tecnologías de la Información.",

      image: null, media: [
        { type: "image", src: null, caption: "Demostración RA doctorado" },
      ],
    },
  ],

  "Productos": [
    {
      id: "prod-1", type: "Producto", title: "Plataforma Gestión de Egresados", date: "2024",
      description: "Desarrollo de plataforma web para la gestión y seguimiento de egresados de la institución.",

      image: null, media: [
        { type: "image", src: null, caption: "Interfaz plataforma" },
      ],
    },
    {
      id: "prod-2", type: "Producto", title: "Alto Chicamocha RA — Gamificación e Inmersión", date: "2025",
      description: "Aplicación móvil funcional para comprender sistemas de energías renovables mediante realidad aumentada y gamificación.",

      image: null, media: [
        { type: "video", src: "/videos/videoJuego.mp4", caption: "Demo Alto Chicamocha" },
        { type: "image", src: null, caption: "Interfaz de la app" },
        { type: "image", src: null, caption: "Interfaz gamificación" },
      ],
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
      { type: "image", src: null, caption: "Estudiantes usando la app" },
      { type: "image", src: null, caption: "Póster presentado" },
    ],
  },
];