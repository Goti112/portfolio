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
    { id: "languages", label: "LENGUAJES", description: "Bases de programación que sigo ampliando a través de proyectos.", capabilities: ["TypeScript", "JavaScript", "PHP", "Java", "Python", "Dart"] },
    { id: "web", label: "WEB", description: "Interfaces y experiencias web claras, responsivas y accesibles.", capabilities: ["React", "Next.js", "HTML", "CSS", "Mapbox GL", "Cesium", "Responsive design", "Web accessibility"] },
    { id: "data-applications", label: "DATOS Y APLICACIONES", description: "Lógica de aplicación, APIs, datos estructurados y aplicaciones móviles.", capabilities: ["Node.js", "REST APIs", "PostgreSQL", "MySQL", "SQL", "Prisma", "Flutter", "Google ML Kit"] },
    { id: "quality", label: "CALIDAD Y ENTREGA", description: "Probar, versionar y llevar una aplicación a un entorno utilizable.", capabilities: ["Git", "GitHub", "Docker", "Playwright", "GitHub Actions", "Linux", "Web deployment"] },
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
    },
    items: [
      {
        id: "qgc-planner",
        name: "QGC Planner",
        summary: "Planificador de misiones inspirado en Mission Planner.",
        highlights: ["Mapa de misión 2D con Mapbox GL", "Vista de vuelo 3D renderizada con Cesium", "Interfaz de planificación de rutas por waypoints en React"],
        technologies: ["TypeScript", "React", "Mapbox GL", "Cesium"],
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        name: "BorderPass AI",
        summary: "Asistente para profesionales aduaneros e importadores que trabajan con controles CBAM.",
        highlights: ["Flujo guiado para revisar el cumplimiento CBAM", "Modelo de datos relacional con PostgreSQL y Prisma", "Aplicación web full-stack con Next.js"],
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
        repository: projectRepositories["borderpass-ai"],
      },
      {
        id: "ticket-ocr",
        name: "Ticket OCR Scanner",
        summary: "Aplicación Flutter que escanea tickets y extrae información estructurada mediante OCR.",
        highlights: ["Captura de tickets con OCR en el dispositivo (Google ML Kit)", "Extracción de campos estructurados a partir del texto", "Exportación de resultados a hojas XLSX"],
        technologies: ["Dart", "Flutter", "Google ML Kit", "XLSX"],
        repository: projectRepositories["ticket-ocr"],
      },
    ],
  },
  education: {
    eyebrow: "Trayectoria / 2022—actualidad",
    heading: "Formación",
    currentLabel: "En curso",
    items: [
      { qualification: "Sistemas Microinformáticos y Redes", abbreviation: "SMX", institution: "Institut Bernat el Ferrer", startYear: 2022, endYear: 2024 },
      { qualification: "Desarrollo de Aplicaciones Web", abbreviation: "DAW", institution: "Institut Bernat el Ferrer", startYear: 2024, endYear: 2026 },
      { qualification: "Desarrollo de Aplicaciones Multiplataforma", abbreviation: "DAM", institution: "Institut Gabriela Mistral", startYear: 2026, endYear: null },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    heading: "¿Hablamos?",
    emailLabel: "Correo",
    githubLabel: "GitHub",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
