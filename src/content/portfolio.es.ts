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
  pendingLink: "ENLACE_PENDIENTE",
  languageLabel: "Cambiar idioma",
  progressLabel: "Progreso de evidencia",
} as const;

const spanishIntro = {
  eyebrow: "MIQUEL MANZANO / DESARROLLADOR FULL-STACK",
  name: "Miquel Manzano",
  role: "Desarrollador full-stack",
  challengeLines: ["NO CONFÍES EN LO QUE DIGO.", "INSPECCIONA EL TRABAJO."],
  availability: "Disponible para crear, aprender y llevar ideas hasta producción.",
} as const;

const spanishClaim = {
  eyebrow: "POSICIONAMIENTO / DE LA INCERTIDUMBRE A LA EJECUCIÓN",
  problemLines: ["PROBLEMA COMPLEJO", "RUTA INCIERTA", "SEÑAL LIMITADA"],
  headingLines: ["CONVIERTO PROBLEMAS COMPLEJOS", "EN PRODUCTOS QUE FUNCIONAN."],
  body: "Desarrollador full-stack formado en sistemas y desarrollo web. Convierto dominios desconocidos en productos funcionales.",
  aiPosition: "Uso la IA como acelerador para abordar mayor complejidad, apoyándome en una base técnica que puedo aplicar de forma autónoma.",
} as const;

const spanishMethod = {
  eyebrow: "MÉTODO / PREGUNTAR → MODELAR → CONSTRUIR → LLEVAR A PRODUCCIÓN",
  headingLines: ["EL CAOS", "SE CONVIERTE", "EN SISTEMA."],
  stages: [
    { id: "question", label: "PREGUNTAR", description: "Aclarar el problema, el contexto y las restricciones.", capabilities: ["HTTP", "REST APIs", "JSON", "Linux", "Terminal"] },
    { id: "model", label: "MODELAR", description: "Convertir el dominio en relaciones, datos y decisiones.", capabilities: ["MySQL", "SQL", "Relational modeling", "Authentication", "Sessions", "User management", "CRUD", "MVC"] },
    { id: "build", label: "CONSTRUIR", description: "Materializar el sistema con una base técnica adaptable.", capabilities: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "PHP", "Java", "Python", "Flutter", "Object-oriented programming"] },
    { id: "ship", label: "LLEVAR A PRODUCCIÓN", description: "Probar, desplegar y mantener una experiencia utilizable.", capabilities: ["Git", "GitHub", "Docker", "Web deployment", "Responsive design", "Web accessibility"] },
  ],
} as const;

export const portfolioSpanish = {
  locale: "es",
  meta: {
    title: "Miquel Manzano — Desarrollador full-stack",
    description:
      "Portfolio técnico de Miquel Manzano: desarrollo web, aplicaciones, IA aplicada y proyectos interactivos.",
  },
  navigation: spanishNavigation,
  system: spanishSystem,
  intro: spanishIntro,
  claim: spanishClaim,
  method: spanishMethod,
  projects: {
    eyebrow: "EXPEDIENTES PRINCIPALES / 03",
    heading: "EVIDENCIA RECUPERADA",
    items: [
      {
        id: "qgc-planner",
        caseLabel: "CASE_01",
        name: "QGC Planner",
        summary: "Planeador de misiones inspirado en Mission Planner.",
        technologies: ["TypeScript", "React", "Mapbox GL", "Cesium"],
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        caseLabel: "CASE_02",
        name: "BorderPass AI",
        summary: "Asistente para profesionales aduaneros e importadores que trabajan con controles CBAM.",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
        repository: projectRepositories["borderpass-ai"],
      },
      {
        id: "ticket-ocr",
        caseLabel: "CASE_03",
        name: "Ticket OCR Scanner",
        summary: "Aplicación Flutter que escanea tickets y extrae información estructurada mediante OCR.",
        technologies: ["Dart", "Flutter", "Google ML Kit", "XLSX"],
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
  verdict: {
    eyebrow: "IDENTIDAD VERIFICADA / SESIÓN SEGURA",
    headingLines: ["PREPARADO PARA", "CONSTRUIR LO SIGUIENTE."],
    availability: "Disponible para crear, aprender y llevar ideas hasta producción.",
    emailLabel: "CORREO",
    githubLabel: "GITHUB",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
