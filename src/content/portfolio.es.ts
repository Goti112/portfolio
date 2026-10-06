import {
  contactDestinations,
  projectRepositories,
} from "@/content/destinations";
import type { PortfolioContent } from "@/content/types";

const spanishNavigation = [
  { label: "Proyectos", target: "projects" },
  { label: "Tecnologías", target: "capabilities" },
  { label: "Formación", target: "education" },
  { label: "Contacto", target: "contact" },
] as const;

const spanishSystem = {
  pendingLink: "Repositorio próximamente",
  languageLabel: "Cambiar idioma",
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
    items: [
      {
        id: "qgc-planner",
        name: "QGC Planner",
        summary: "Planificador de misiones inspirado en Mission Planner.",
        technologies: ["TypeScript", "React", "Mapbox GL", "Cesium"],
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        name: "BorderPass AI",
        summary: "Asistente para profesionales aduaneros e importadores que trabajan con controles CBAM.",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
        repository: projectRepositories["borderpass-ai"],
      },
      {
        id: "ticket-ocr",
        name: "Ticket OCR Scanner",
        summary: "Aplicación Flutter que escanea tickets y extrae información estructurada mediante OCR.",
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
