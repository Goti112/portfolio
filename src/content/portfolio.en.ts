import {
  contactDestinations,
  projectRepositories,
} from "@/content/destinations";
import type { PortfolioContent } from "@/content/types";

const englishNavigation = [
  { label: "Technologies", target: "capabilities" },
  { label: "Projects", target: "projects" },
  { label: "Education", target: "education" },
  { label: "Contact", target: "contact" },
] as const;

const englishSystem = {
  pendingLink: "Repository coming soon",
  languageLabel: "Change language",
  header: {
    broadcastLabel: "REC",
    channelPrefix: "CH",
    homeChannelLabel: "PROFILE",
    currentChannelLabel: "Current section",
    navigationLabel: "Main navigation",
    skipLabel: "Skip to content",
    languageTargetLabel: "Español",
  },
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
  terminal: {
    channelPrefix: "CH",
    nodesLabel: "NODES",
    linkedLabel: "LINKED",
    legendPrefix: "used in shipped projects",
    legendLink: "See projects ↓",
    linkedDescription: "used in projects",
    carrier: "NO CARRIER → CONNECTED",
    sideNote: "PRESENT DAY, PRESENT TIME",
  },
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
    labels: {
      channelPrefix: "CH",
      indexLabel: "Project channels",
      summaryLabel: "What it does",
      highlightsLabel: "What I built",
      stackLabel: "Stack",
    },
    items: [
      {
        id: "qgc-planner",
        name: "QGC Planner",
        summary: "Mission planner inspired by Mission Planner.",
        highlights: ["2D mission map built with Mapbox GL", "3D flight view rendered with Cesium", "Waypoint route planning interface in React"],
        technologies: ["TypeScript", "React", "Mapbox GL", "Cesium"],
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        name: "BorderPass AI",
        summary: "Assistant for customs professionals and importers working with CBAM controls.",
        highlights: ["Guided workflow for CBAM compliance checks", "Relational data model with PostgreSQL and Prisma", "Full-stack web app built on Next.js"],
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
        repository: projectRepositories["borderpass-ai"],
      },
      {
        id: "ticket-ocr",
        name: "Ticket OCR Scanner",
        summary: "Flutter application that scans tickets and extracts structured information through OCR.",
        highlights: ["Ticket capture with on-device OCR (Google ML Kit)", "Extraction of structured fields from raw text", "Export of results to XLSX spreadsheets"],
        technologies: ["Dart", "Flutter", "Google ML Kit", "XLSX"],
        repository: projectRepositories["ticket-ocr"],
      },
    ],
  },
  education: {
    eyebrow: "Journey / 2022—present",
    heading: "Education",
    currentLabel: "In progress",
    traceLabel: "Signal trace // 2022 → now",
    items: [
      { qualification: "Microcomputer Systems and Networks", level: "Intermediate VET diploma", abbreviation: "SMX", institution: "Institut Bernat el Ferrer", startYear: 2022, endYear: 2024 },
      { qualification: "Web Application Development", level: "Higher VET diploma", abbreviation: "DAW", institution: "Institut Bernat el Ferrer", startYear: 2024, endYear: 2026, internship: { label: "Company internship", period: "Jan — Jul 2026", startMonth: "2026-01", endMonth: "2026-07", description: "Software development with TypeScript and React.", technologies: ["TypeScript", "React"] } },
      { qualification: "Multiplatform Application Development", level: "Higher VET diploma", abbreviation: "DAM", institution: "Institut Gabriela Mistral", startYear: 2026, endYear: null },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Let's talk",
    emailLabel: "Email",
    githubLabel: "GitHub",
    lead: "I'm looking for my first role as a junior web and mobile application developer.",
    statusLabel: "Status",
    availability: "Available immediately",
    details: [
      { label: "Role", value: "Junior developer · Web / Mobile" },
      { label: "Schedule", value: "Full-time or part-time · alongside studies" },
      { label: "Location", value: "Barcelona · On-site, hybrid or remote" },
    ],
    copyLabel: "Copy email",
    copiedLabel: "Copied",
    closing: "End of transmission // Present day, present time",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
