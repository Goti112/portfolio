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
  pendingLink: "LINK_PENDING",
  languageLabel: "Change language",
  progressLabel: "Evidence progress",
} as const;

const englishIntro = {
  eyebrow: "MIQUEL MANZANO / FULL-STACK DEVELOPER",
  name: "Miquel Manzano",
  role: "Full-stack developer",
  challengeLines: ["DON'T TRUST THE CLAIM.", "INSPECT THE WORK."],
  availability: "Available to create, learn, and take ideas all the way to production.",
} as const;

const englishClaim = {
  eyebrow: "POSITIONING / FROM UNCERTAINTY TO EXECUTION",
  problemLines: ["COMPLEX PROBLEM", "UNCERTAIN PATH", "LIMITED SIGNAL"],
  headingLines: ["I TURN COMPLEX PROBLEMS", "INTO WORKING PRODUCTS."],
  body: "Full-stack developer trained in systems and web development. I turn unfamiliar domains into working products.",
  aiPosition: "I use AI as an accelerator for greater complexity, supported by a technical foundation I can apply independently.",
} as const;

const englishMethod = {
  eyebrow: "METHOD / QUESTION → MODEL → BUILD → SHIP",
  headingLines: ["CHAOS", "BECOMES", "SYSTEM."],
  stages: [
    { id: "question", label: "QUESTION", description: "Clarify the problem, context, and constraints.", capabilities: ["HTTP", "REST APIs", "JSON", "Linux", "Terminal"] },
    { id: "model", label: "MODEL", description: "Turn the domain into relationships, data, and decisions.", capabilities: ["MySQL", "SQL", "Relational modeling", "Authentication", "Sessions", "User management", "CRUD", "MVC"] },
    { id: "build", label: "BUILD", description: "Materialize the system with an adaptable technical foundation.", capabilities: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "PHP", "Java", "Python", "Flutter", "Object-oriented programming"] },
    { id: "ship", label: "SHIP", description: "Test, deploy, and maintain a usable experience.", capabilities: ["Git", "GitHub", "Docker", "Web deployment", "Responsive design", "Web accessibility"] },
  ],
} as const;

export const portfolioEnglish = {
  locale: "en",
  meta: {
    title: "Miquel Manzano — Full-stack developer",
    description:
      "Technical portfolio of Miquel Manzano: web development, applications, applied AI, and interactive projects.",
  },
  navigation: englishNavigation,
  system: englishSystem,
  intro: englishIntro,
  claim: englishClaim,
  method: englishMethod,
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
  verdict: {
    eyebrow: "IDENTITY VERIFIED / SESSION SECURE",
    headingLines: ["READY TO BUILD", "THE NEXT ONE."],
    availability: "Available to create, learn, and take ideas all the way to production.",
    emailLabel: "EMAIL",
    githubLabel: "GITHUB",
    email: contactDestinations.email,
    github: contactDestinations.github,
  },
} as const satisfies PortfolioContent;
