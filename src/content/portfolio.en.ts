import {
  contactDestinations,
  projectRepositories,
} from "@/content/destinations";
import type { PortfolioContent } from "@/content/types";

const englishNavigation = [
  { label: "Projects", target: "projects" },
  { label: "Technologies", target: "capabilities" },
  { label: "Education", target: "education" },
  { label: "Contact", target: "contact" },
] as const;

const englishSystem = {
  pendingLink: "Repository coming soon",
  languageLabel: "Change language",
} as const;

const englishIntro = {
  eyebrow: "Portfolio / Application development",
  name: "Miquel Manzano",
  role: "Application developer",
  summary: "I build web and mobile applications with a focus on clear interfaces, useful data, and working solutions.",
  availability: "Open to new projects and opportunities.",
  projectsLabel: "View projects",
  contactLabel: "Get in touch",
} as const;

const englishMethod = {
  eyebrow: "Capabilities",
  heading: "Technologies",
  stages: [
    { id: "languages", label: "LANGUAGES", description: "Programming foundations I keep expanding through projects.", capabilities: ["TypeScript", "JavaScript", "PHP", "Java", "Python", "Dart"] },
    { id: "web", label: "WEB", description: "Clear, responsive, and accessible web interfaces and experiences.", capabilities: ["React", "Next.js", "HTML", "CSS", "Mapbox GL", "Cesium", "Responsive design", "Web accessibility"] },
    { id: "data-applications", label: "DATA AND APPLICATIONS", description: "Application logic, APIs, structured data, and mobile applications.", capabilities: ["Node.js", "REST APIs", "PostgreSQL", "MySQL", "SQL", "Prisma", "Flutter", "Google ML Kit"] },
    { id: "quality", label: "QUALITY AND DELIVERY", description: "Test, version, and take an application into a usable environment.", capabilities: ["Git", "GitHub", "Docker", "Playwright", "GitHub Actions", "Linux", "Web deployment"] },
  ],
} as const;

export const portfolioEnglish = {
  locale: "en",
  meta: {
    title: "Miquel Manzano — Application developer",
    description:
      "Technical portfolio of Miquel Manzano: web, mobile, and interactive application development.",
  },
  navigation: englishNavigation,
  system: englishSystem,
  intro: englishIntro,
  method: englishMethod,
  projects: {
    eyebrow: "Selected work / 03",
    heading: "Projects",
    items: [
      {
        id: "qgc-planner",
        name: "QGC Planner",
        summary: "Mission planner inspired by Mission Planner.",
        technologies: ["TypeScript", "React", "Mapbox GL", "Cesium"],
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        name: "BorderPass AI",
        summary: "Assistant for customs professionals and importers working with CBAM controls.",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
        repository: projectRepositories["borderpass-ai"],
      },
      {
        id: "ticket-ocr",
        name: "Ticket OCR Scanner",
        summary: "Flutter application that scans tickets and extracts structured information through OCR.",
        technologies: ["Dart", "Flutter", "Google ML Kit", "XLSX"],
        repository: projectRepositories["ticket-ocr"],
      },
    ],
  },
  education: {
    eyebrow: "Journey / 2022—present",
    heading: "Education",
    currentLabel: "In progress",
    items: [
      { qualification: "Microcomputer Systems and Networks", abbreviation: "SMX", institution: "Institut Bernat el Ferrer", startYear: 2022, endYear: 2024 },
      { qualification: "Web Application Development", abbreviation: "DAW", institution: "Institut Bernat el Ferrer", startYear: 2024, endYear: 2026 },
      { qualification: "Multiplatform Application Development", abbreviation: "DAM", institution: "Institut Bernat el Ferrer", startYear: 2026, endYear: null },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Let's talk",
    emailLabel: "Email",
    githubLabel: "GitHub",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
