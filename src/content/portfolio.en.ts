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
    { id: "web", label: "WEB", description: "Clear, responsive, and accessible web interfaces and experiences.", capabilities: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Vite", "GSAP", "Three.js"] },
    { id: "data-applications", label: "BACKEND & MOBILE", description: "APIs, server-side logic, SQL and NoSQL databases, and mobile applications.", capabilities: ["Node.js", "Laravel", "Spring Boot", "REST APIs", "MVC", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "Prisma", "Flutter", "Google ML Kit"] },
    { id: "quality", label: "TESTING & DEVOPS", description: "Test, version, automate, and deploy applications, working with agile methodologies.", capabilities: ["Git", "GitHub Actions", "Docker", "Vitest", "Linux", "Vercel", "Scrum"] },
  ],
} as const;

export const portfolioEnglish = {
  locale: "en",
  meta: {
    title: "Miquel Manzano — Full Stack Developer",
    description:
      "Portfolio of Miquel Manzano, a full stack developer in Barcelona building web and mobile apps with React, TypeScript, Next.js, Node.js, Java and Flutter.",
  },
  navigation: englishNavigation,
  system: englishSystem,
  intro: englishIntro,
  method: englishMethod,
  projects: {
    eyebrow: "Selected work / 04",
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
        id: "github-city",
        name: "GitHub City",
        summary: "Turns any GitHub profile into a 3D city you can explore.",
        highlights: ["3D scene with React Three Fiber: every repository is a building and every language a district", "Serverless API that aggregates a profile with a single GraphQL query to GitHub", "Profile duels and share preview cards for social networks"],
        technologies: ["TypeScript", "React", "Three.js", "Vite", "Vercel", "Vitest"],
        tooling: ["GitHub Actions"],
        screenshot: { src: "/projects/github-city.webp", width: 1280, height: 720, alt: "GitHub City screenshot: 3D night city generated from a GitHub profile, with neon buildings grouped by language." },
        repository: projectRepositories["github-city"],
      },
      {
        id: "weft",
        name: "Weft",
        summary: "Local-first collaborative text editor: several people edit the same document, even offline, and every copy ends up with the same text.",
        highlights: ["Text CRDT (Fugue) written from scratch in TypeScript and verified with property-based tests", "Sync server in Java 21 and Spring Boot over WebSocket, with PostgreSQL and idempotent retries", "Demo with three editors, a simulated network and an inspector for protocol messages and the CRDT tree"],
        technologies: ["TypeScript", "React", "Java", "Spring Boot", "PostgreSQL", "Vitest"],
        tooling: ["GitHub Actions", "Docker"],
        screenshot: { src: "/projects/weft.webp", width: 1440, height: 1018, alt: "Weft screenshot: three editors of the same document, connected and showing the same text after the guided scenario, next to the simulated network controls and the protocol inspector." },
        repository: projectRepositories["weft"],
      },
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
      { qualification: "Web Application Development", level: "Higher VET diploma", abbreviation: "DAW", institution: "Institut Bernat el Ferrer", startYear: 2024, endYear: 2026, internship: { label: "Company internship", period: "Jan — Jul 2026", startMonth: "2026-01", endMonth: "2026-07", description: "Web application development with React and TypeScript.", technologies: ["TypeScript", "React"] } },
      { qualification: "Multiplatform Application Development", level: "Higher VET diploma", abbreviation: "DAM", institution: "Institut Gabriela Mistral", startYear: 2026, endYear: null },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Let's talk",
    emailLabel: "Email",
    githubLabel: "GitHub",
    lead: "I'm looking for new opportunities as a web and mobile application developer.",
    statusLabel: "Status",
    availability: "Available immediately",
    details: [
      { label: "Role", value: "Application developer · Web / Mobile" },
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
