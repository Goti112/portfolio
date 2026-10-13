import {
  contactDestinations,
  projectRepositories,
} from "@/content/destinations";
import type { PortfolioContent } from "@/content/types";

const spanishNavigation = [
  { label: "Tecnologías", target: "capabilities" },
  { label: "Proyectos", target: "projects" },
  { label: "Formación", target: "education" },
  { label: "Contacto", target: "contact" },
] as const;

const spanishSystem = {
  pendingLink: "Repositorio próximamente",
  languageLabel: "Cambiar idioma",
  header: {
    broadcastLabel: "REC",
    channelPrefix: "CH",
    homeChannelLabel: "PERFIL",
    currentChannelLabel: "Sección actual",
    navigationLabel: "Navegación principal",
    skipLabel: "Saltar al contenido",
    languageTargetLabel: "English",
  },
} as const;

const spanishIntro = {
  eyebrow: "Portfolio / Desarrollo de aplicaciones",
  name: "Miquel Manzano",
  role: "Desarrollador de aplicaciones",
  summary: "Construyo aplicaciones web y móviles con foco en interfaces claras, datos útiles y soluciones que funcionan.",
  availability: "Disponible para nuevos proyectos y oportunidades.",
  projectsLabel: "Ver proyectos",
  contactLabel: "Contactar",
} as const;

const spanishMethod = {
  eyebrow: "Capacidades",
  heading: "Tecnologías",
  terminal: {
    channelPrefix: "CH",
    nodesLabel: "NODOS",
    linkedLabel: "LINKED",
    legendPrefix: "usada en proyectos reales",
    legendLink: "Ver proyectos ↓",
    linkedDescription: "usada en proyectos",
    carrier: "NO CARRIER → CONECTADO",
    sideNote: "PRESENT DAY, PRESENT TIME",
  },
  stages: [
    { id: "languages", label: "LENGUAJES", description: "Bases de programación que sigo ampliando a través de proyectos.", capabilities: ["TypeScript", "JavaScript", "PHP", "Java", "C#", "Python", "Dart", "SQL"] },
    { id: "web", label: "WEB", description: "Interfaces y experiencias web claras, responsivas y accesibles.", capabilities: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Vite", "GSAP", "Three.js"] },
    { id: "data-applications", label: "BACKEND Y MÓVIL", description: "APIs, lógica de servidor, bases de datos SQL y NoSQL, y aplicaciones móviles.", capabilities: ["Node.js", "Laravel", "Spring Boot", "REST APIs", "MVC", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "Prisma", "Flutter", "Google ML Kit"] },
    { id: "quality", label: "TESTING Y DEVOPS", description: "Probar, versionar, automatizar y desplegar aplicaciones, trabajando con metodologías ágiles.", capabilities: ["Git", "GitHub Actions", "Docker", "Vitest", "Linux", "Vercel", "Scrum"] },
  ],
} as const;

export const portfolioSpanish = {
  locale: "es",
  meta: {
    title: "Miquel Manzano — Desarrollador de aplicaciones",
    description:
      "Portfolio técnico de Miquel Manzano: desarrollo de aplicaciones web, móviles e interactivas.",
  },
  navigation: spanishNavigation,
  system: spanishSystem,
  intro: spanishIntro,
  method: spanishMethod,
  projects: {
    eyebrow: "Trabajo seleccionado / 03",
    heading: "Proyectos",
    labels: {
      channelPrefix: "CH",
      indexLabel: "Canales de proyectos",
      summaryLabel: "Qué hace",
      highlightsLabel: "Qué construí",
      stackLabel: "Stack",
      sourceLabel: "Captura real",
      enlargeLabel: "Ampliar captura",
      closeLabel: "Cerrar",
    },
    items: [
      {
        id: "github-city",
        name: "GitHub City",
        summary: "Convierte cualquier perfil de GitHub en una ciudad 3D que se puede recorrer.",
        highlights: ["Escena 3D con React Three Fiber: cada repositorio es un edificio y cada lenguaje un barrio", "API serverless que agrega el perfil con una sola consulta GraphQL a GitHub", "Duelo entre perfiles y tarjetas de vista previa para compartir en redes"],
        technologies: ["TypeScript", "React", "Three.js", "Vite", "Vercel", "Vitest"],
        tooling: ["GitHub Actions"],
        screenshot: { src: "/projects/github-city.webp", width: 1280, height: 720, alt: "Captura de GitHub City: ciudad 3D de noche generada a partir de un perfil de GitHub, con edificios de neón agrupados por lenguaje." },
        repository: projectRepositories["github-city"],
      },
      {
        id: "qgc-planner",
        name: "QGC Planner",
        summary: "Planificador de misiones inspirado en Mission Planner.",
        highlights: ["Mapa de misión 2D con Mapbox GL", "Vista de vuelo 3D renderizada con Cesium", "Interfaz de planificación de rutas por waypoints en React"],
        technologies: ["TypeScript", "React", "Vite", "Mapbox GL", "Cesium", "Vitest"],
        tooling: ["GitHub Actions"],
        screenshot: { src: "/projects/qgc-planner.webp", width: 1600, height: 733, alt: "Captura de QGC Planner: vista 3D de una misión de dron sobre la ciudad con waypoints, ruta y panel de telemetría de vuelo." },
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        name: "BorderPass AI",
        summary: "Asistente para profesionales aduaneros e importadores que trabajan con controles CBAM.",
        highlights: ["Flujo guiado para revisar el cumplimiento CBAM", "Modelo de datos relacional con PostgreSQL y Prisma", "Aplicación web full-stack con Next.js"],
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
        tooling: ["GitHub Actions"],
        screenshot: { src: "/projects/borderpass-ai.webp", width: 1440, height: 1000, alt: "Captura de BorderPass AI: panel operativo con casos CBAM pendientes de revisión, obligaciones abiertas y seguimiento de proveedores." },
        repository: projectRepositories["borderpass-ai"],
      },
    ],
  },
  education: {
    eyebrow: "Trayectoria / 2022—actualidad",
    heading: "Formación",
    currentLabel: "En curso",
    traceLabel: "Signal trace // 2022 → ahora",
    items: [
      { qualification: "Sistemas Microinformáticos y Redes", level: "Grado Medio", abbreviation: "SMX", institution: "Institut Bernat el Ferrer", startYear: 2022, endYear: 2024 },
      { qualification: "Desarrollo de Aplicaciones Web", level: "Grado Superior", abbreviation: "DAW", institution: "Institut Bernat el Ferrer", startYear: 2024, endYear: 2026, internship: { label: "Prácticas en empresa", period: "Ene — Jul 2026", startMonth: "2026-01", endMonth: "2026-07", description: "Desarrollo de aplicaciones web con React y TypeScript.", technologies: ["TypeScript", "React"] } },
      { qualification: "Desarrollo de Aplicaciones Multiplataforma", level: "Grado Superior", abbreviation: "DAM", institution: "Institut Gabriela Mistral", startYear: 2026, endYear: null },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    heading: "¿Hablamos?",
    emailLabel: "Correo",
    githubLabel: "GitHub",
    lead: "Busco mi primer puesto como desarrollador junior de aplicaciones web y móviles.",
    statusLabel: "Status",
    availability: "Disponibilidad inmediata",
    details: [
      { label: "Rol", value: "Desarrollador junior · Web / Mobile" },
      { label: "Jornada", value: "Completa o parcial · compatible con estudios" },
      { label: "Ubicación", value: "Barcelona · Presencial, híbrido o remoto" },
    ],
    copyLabel: "Copiar correo",
    copiedLabel: "Copiado",
    closing: "End of transmission // Present day, present time",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
