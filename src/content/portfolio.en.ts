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
    { id: "languages", label: "LANGUAGES", description: "Programming foundations I keep expanding through projects.", capabilities: ["TypeScript", "JavaScript", "PHP", "Java", "C#", "Python", "Dart", "SQL"] },
    { id: "web", label: "WEB", description: "Clear, responsive, and accessible web interfaces and experiences.", capabilities: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Vite", "GSAP"] },
    { id: "data-applications", label: "BACKEND & MOBILE", description: "APIs, server-side logic, SQL and NoSQL databases, and mobile applications.", capabilities: ["Node.js", "Laravel", "Spring Boot", "REST APIs", "MVC", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "Prisma", "Flutter", "Google ML Kit"] },
    { id: "quality", label: "TESTING & DEVOPS", description: "Test, version, automate, and deploy applications, working with agile methodologies.", capabilities: ["Git", "GitHub Actions", "Docker", "Vitest", "Linux", "Vercel", "Scrum"] },
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
    eyebrow: "Selected work / 02",
    heading: "Projects",
    labels: {
      channelPrefix: "CH",
      indexLabel: "Project channels",
      summaryLabel: "What it does",
      highlightsLabel: "What I built",
      stackLabel: "Stack",
      sourceLabel: "Live capture",
      enlargeLabel: "Enlarge screenshot",
      closeLabel: "Close",
    },
    items: [
      {
        id: "qgc-planner",
        name: "QGC Planner",
        summary: "Mission planner inspired by Mission Planner.",
        highlights: ["2D mission map built with Mapbox GL", "3D flight view rendered with Cesium", "Waypoint route planning interface in React"],
        technologies: ["TypeScript", "React", "Vite", "Mapbox GL", "Cesium", "Vitest"],
        tooling: ["GitHub Actions"],
        screenshot: { src: "/projects/qgc-planner.webp", width: 1600, height: 733, alt: "QGC Planner screenshot: 3D view of a drone mission over a city with waypoints, route and flight telemetry panel." },
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        name: "BorderPass AI",
        summary: "Assistant for customs professionals and importers working with CBAM controls.",
        highlights: ["Guided workflow for CBAM compliance checks", "Relational data model with PostgreSQL and Prisma", "Full-stack web app built on Next.js"],
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
        tooling: ["GitHub Actions"],
        screenshot: { src: "/projects/borderpass-ai.webp", width: 1440, height: 1000, alt: "BorderPass AI screenshot: operational dashboard with CBAM cases needing review, open obligations and supplier follow-up." },
        repository: projectRepositories["borderpass-ai"],
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
