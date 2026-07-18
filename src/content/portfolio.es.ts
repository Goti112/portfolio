import {
  contactDestinations,
  experimentRepositories,
  projectRepositories,
} from "@/content/destinations";
import type { PortfolioContent } from "@/content/types";

const spanishNavigation = [
  { label: "Perfil", target: "profile" },
  { label: "Capacidades", target: "capabilities" },
  { label: "Proyectos", target: "projects" },
  { label: "Formación", target: "education" },
  { label: "Contacto", target: "contact" },
] as const;

const spanishSystem = {
  readOnly: "SESIÓN_DESCONOCIDA / SOLO_LECTURA",
  pendingLink: "ENLACE_PENDIENTE",
  languageLabel: "Cambiar idioma",
} as const;

const spanishEvidence = [
  { label: "FORMACIÓN", value: "SISTEMAS + DESARROLLO WEB" },
  { label: "MÉTODO", value: "CONSTRUIR → PROBAR → APRENDER" },
  { label: "ESTADO", value: "DISPONIBLE" },
] as const;

export const portfolioSpanish = {
  locale: "es",
  meta: {
    title: "Miquel Manzano — Desarrollador full-stack",
    description:
      "Portfolio técnico de Miquel Manzano: desarrollo web, aplicaciones, IA aplicada y proyectos interactivos.",
  },
  navigation: spanishNavigation,
  system: spanishSystem,
  intro: {
    eyebrow: "SESIÓN DESCONOCIDA / ACCESO DE SOLO LECTURA",
    name: "Miquel Manzano",
    titleLines: ["AÚN", "NO", "ME CONOCES."],
    availability: "Disponible para crear, aprender y llevar ideas hasta producción.",
    command: "visitor@portfolio:~$ whoami --verify",
  },
  identity: {
    eyebrow: "RECONSTRUCCIÓN DE IDENTIDAD / 34%",
    headingLines: ["Técnico.", "Creativo.", "Adaptable."],
    body: "Desarrollador full-stack formado en sistemas y desarrollo web. Convierto dominios desconocidos en productos funcionales.",
    aiPosition:
      "Uso la IA como acelerador para abordar mayor complejidad, apoyándome en una base técnica que puedo aplicar de forma autónoma.",
    evidence: spanishEvidence,
  },
  capabilities: {
    eyebrow: "ANÁLISIS DE FUENTE / SIN BARRAS DE HABILIDAD",
    heading: "INSPECCIONA LA LÓGICA REAL.",
    groups: [
      {
        title: "Lenguajes y producto",
        items: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "PHP", "MySQL", "Java", "Python", "Flutter"],
      },
      {
        title: "Aplicaciones y datos",
        items: ["REST APIs", "HTTP", "JSON", "SQL", "Relational modeling", "Authentication", "Sessions", "User management", "CRUD"],
      },
      {
        title: "Herramientas y arquitectura",
        items: ["Git", "GitHub", "Linux", "Terminal", "Web deployment", "Docker", "MVC", "Object-oriented programming", "Responsive design", "Web accessibility"],
      },
    ],
  },
  projects: {
    eyebrow: "EXPEDIENTES PRINCIPALES / 03",
    heading: "EVIDENCIA RECUPERADA",
    items: [
      {
        id: "qgc-planner",
        caseLabel: "CASE_01",
        name: "QGC Planner",
        summary: "Planeador de misiones inspirado en Mission Planner.",
        technologies: ["React", "TypeScript", "MAVLink"],
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        caseLabel: "CASE_02",
        name: "BorderPass AI",
        summary: "Asistente para profesionales aduaneros e importadores que trabajan con controles CBAM.",
        technologies: ["AI", "CBAM"],
        repository: projectRepositories["borderpass-ai"],
      },
      {
        id: "ticket-ocr",
        caseLabel: "CASE_03",
        name: "Ticket OCR Scanner",
        summary: "Aplicación Flutter que escanea tickets y extrae información estructurada mediante OCR.",
        technologies: ["Flutter", "OCR"],
        repository: projectRepositories["ticket-ocr"],
      },
    ],
  },
  experiments: {
    eyebrow: "ÍNDICE DE EXPERIMENTOS / 03",
    heading: "ARCHIVOS SECUNDARIOS",
    items: [
      { id: "web-game", name: "Web Game", category: "Juego web", repository: experimentRepositories["web-game"] },
      { id: "roblox-game", name: "Roblox Game", category: "Experiencia Roblox", repository: experimentRepositories["roblox-game"] },
      { id: "ai-wrapped", name: "AI Wrapped", category: "Experimento de IA", repository: experimentRepositories["ai-wrapped"] },
    ],
  },
  education: {
    eyebrow: "TRAZA FORMATIVA / 2022—2026",
    heading: "REGISTRO DE FORMACIÓN",
    items: [
      { qualification: "Sistemas Microinformáticos y Redes", abbreviation: "SMX", institution: "Institut Bernat el Ferrer", startYear: 2022, endYear: 2024 },
      { qualification: "Desarrollo de Aplicaciones Web", abbreviation: "DAW", institution: "Institut Bernat el Ferrer", startYear: 2024, endYear: 2026 },
    ],
  },
  exit: {
    eyebrow: "IDENTIDAD VERIFICADA / SESIÓN SEGURA",
    headingLines: ["SESIÓN COMPLETA.", "CONSTRUYAMOS."],
    availability: "Disponible para crear, aprender y llevar ideas hasta producción.",
    emailLabel: "CORREO",
    githubLabel: "GITHUB",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
