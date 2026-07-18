import {
  contactDestinations,
  experimentRepositories,
  projectRepositories,
} from "@/content/destinations";
import type { PortfolioContent } from "@/content/types";

const englishNavigation = [
  { label: "Profile", target: "profile" },
  { label: "Capabilities", target: "capabilities" },
  { label: "Projects", target: "projects" },
  { label: "Education", target: "education" },
  { label: "Contact", target: "contact" },
] as const;

const englishSystem = {
  readOnly: "UNKNOWN_SESSION / READ_ONLY",
  pendingLink: "LINK_PENDING",
  languageLabel: "Change language",
} as const;

const englishEvidence = [
  { label: "FOUNDATION", value: "SYSTEMS + WEB DEVELOPMENT" },
  { label: "METHOD", value: "BUILD → TEST → LEARN" },
  { label: "STATUS", value: "AVAILABLE" },
] as const;

export const portfolioEnglish = {
  locale: "en",
  meta: {
    title: "Miquel Manzano — Full-stack developer",
    description:
      "Technical portfolio of Miquel Manzano: web development, applications, applied AI, and interactive projects.",
  },
  navigation: englishNavigation,
  system: englishSystem,
  intro: {
    eyebrow: "UNKNOWN SESSION / READ-ONLY ACCESS",
    name: "Miquel Manzano",
    titleLines: ["YOU DON'T", "KNOW", "ME YET."],
    availability: "Available to create, learn, and take ideas all the way to production.",
    command: "visitor@portfolio:~$ whoami --verify",
  },
  identity: {
    eyebrow: "IDENTITY RECONSTRUCTION / 34%",
    headingLines: ["Technical.", "Creative.", "Adaptable."],
    body: "Full-stack developer trained in systems and web development. I turn unfamiliar domains into working products.",
    aiPosition:
      "I use AI as an accelerator for greater complexity, supported by a technical foundation I can apply independently.",
    evidence: englishEvidence,
  },
  capabilities: {
    eyebrow: "SOURCE ANALYSIS / NO SKILL BARS",
    heading: "INSPECT THE ACTUAL LOGIC.",
    groups: [
      {
        title: "Languages and product",
        items: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "PHP", "MySQL", "Java", "Python", "Flutter"],
      },
      {
        title: "Applications and data",
        items: ["REST APIs", "HTTP", "JSON", "SQL", "Relational modeling", "Authentication", "Sessions", "User management", "CRUD"],
      },
      {
        title: "Tools and architecture",
        items: ["Git", "GitHub", "Linux", "Terminal", "Web deployment", "Docker", "MVC", "Object-oriented programming", "Responsive design", "Web accessibility"],
      },
    ],
  },
  projects: {
    eyebrow: "PRIMARY CASE FILES / 03",
    heading: "RECOVERED EVIDENCE",
    items: [
      {
        id: "qgc-planner",
        caseLabel: "CASE_01",
        name: "QGC Planner",
        summary: "Mission planner inspired by Mission Planner.",
        technologies: ["React", "TypeScript", "MAVLink"],
        repository: projectRepositories["qgc-planner"],
      },
      {
        id: "borderpass-ai",
        caseLabel: "CASE_02",
        name: "BorderPass AI",
        summary: "Assistant for customs professionals and importers working with CBAM controls.",
        technologies: ["AI", "CBAM"],
        repository: projectRepositories["borderpass-ai"],
      },
      {
        id: "ticket-ocr",
        caseLabel: "CASE_03",
        name: "Ticket OCR Scanner",
        summary: "Flutter application that scans tickets and extracts structured information through OCR.",
        technologies: ["Flutter", "OCR"],
        repository: projectRepositories["ticket-ocr"],
      },
    ],
  },
  experiments: {
    eyebrow: "EXPERIMENT INDEX / 03",
    heading: "SECONDARY FILES",
    items: [
      { id: "web-game", name: "Web Game", category: "Web game", repository: experimentRepositories["web-game"] },
      { id: "roblox-game", name: "Roblox Game", category: "Roblox experience", repository: experimentRepositories["roblox-game"] },
      { id: "ai-wrapped", name: "AI Wrapped", category: "AI experiment", repository: experimentRepositories["ai-wrapped"] },
    ],
  },
  education: {
    eyebrow: "EDUCATION TRACE / 2022—2026",
    heading: "EDUCATION LOG",
    items: [
      { qualification: "Microcomputer Systems and Networks", abbreviation: "SMX", institution: "Institut Bernat el Ferrer", startYear: 2022, endYear: 2024 },
      { qualification: "Web Application Development", abbreviation: "DAW", institution: "Institut Bernat el Ferrer", startYear: 2024, endYear: 2026 },
    ],
  },
  exit: {
    eyebrow: "IDENTITY VERIFIED / SESSION SECURE",
    headingLines: ["SESSION COMPLETE.", "LET'S BUILD."],
    availability: "Available to create, learn, and take ideas all the way to production.",
    emailLabel: "EMAIL",
    githubLabel: "GITHUB",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
