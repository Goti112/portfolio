export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];
export type PrimaryProjectId = "qgc-planner" | "borderpass-ai" | "ticket-ocr";

export type ExternalDestination =
  | { readonly status: "pending" }
  | { readonly status: "published"; readonly url: string };

export interface NavigationItem {
  readonly label: string;
  readonly target: "profile" | "capabilities" | "projects" | "education" | "contact";
}

export interface CapabilityGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface PrimaryProject {
  readonly id: PrimaryProjectId;
  readonly caseLabel: string;
  readonly name: string;
  readonly summary: string;
  readonly technologies: readonly string[];
  readonly repository: ExternalDestination;
}

export interface Experiment {
  readonly id: "web-game" | "roblox-game" | "ai-wrapped";
  readonly name: string;
  readonly category: string;
  readonly repository: ExternalDestination;
}

export interface EducationItem {
  readonly qualification: string;
  readonly abbreviation: "SMX" | "DAW";
  readonly institution: "Institut Bernat el Ferrer";
  readonly startYear: 2022 | 2024;
  readonly endYear: 2024 | 2026;
}

export interface PortfolioContent {
  readonly locale: Locale;
  readonly meta: { readonly title: string; readonly description: string };
  readonly navigation: readonly NavigationItem[];
  readonly system: {
    readonly readOnly: string;
    readonly pendingLink: string;
    readonly languageLabel: string;
  };
  readonly intro: {
    readonly eyebrow: string;
    readonly name: "Miquel Manzano";
    readonly titleLines: readonly [string, string, string];
    readonly availability: string;
    readonly command: string;
  };
  readonly identity: {
    readonly eyebrow: string;
    readonly headingLines: readonly [string, string, string];
    readonly body: string;
    readonly aiPosition: string;
    readonly evidence: readonly [
      { readonly label: string; readonly value: string },
      { readonly label: string; readonly value: string },
      { readonly label: string; readonly value: string },
    ];
  };
  readonly capabilities: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly groups: readonly CapabilityGroup[];
  };
  readonly projects: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly PrimaryProject[];
  };
  readonly experiments: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly Experiment[];
  };
  readonly education: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly EducationItem[];
  };
  readonly exit: {
    readonly eyebrow: string;
    readonly headingLines: readonly [string, string];
    readonly availability: string;
    readonly emailLabel: string;
    readonly githubLabel: string;
    readonly email: ExternalDestination;
    readonly github: ExternalDestination;
  };
}
