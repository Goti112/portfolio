export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];
export type PrimaryProjectId = "qgc-planner" | "borderpass-ai" | "ticket-ocr";
export type FutureProjectId = "future-project-01" | "future-project-02" | "future-project-03";
export type MethodStageId = "question" | "model" | "build" | "ship";

export type ExternalDestination =
  | { readonly status: "pending" }
  | { readonly status: "published"; readonly url: string };

export interface NavigationItem {
  readonly label: string;
  readonly target: "profile" | "capabilities" | "projects" | "education" | "contact";
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
  readonly id: FutureProjectId;
  readonly marker: "?";
  readonly ariaLabel: string;
}

export interface EducationItem {
  readonly qualification: string;
  readonly abbreviation: "SMX" | "DAW";
  readonly institution: "Institut Bernat el Ferrer";
  readonly startYear: 2022 | 2024;
  readonly endYear: 2024 | 2026;
}

export interface MethodStage {
  readonly id: MethodStageId;
  readonly label: string;
  readonly description: string;
  readonly capabilities: readonly string[];
}

export interface PortfolioContent {
  readonly locale: Locale;
  readonly meta: { readonly title: string; readonly description: string };
  readonly navigation: readonly NavigationItem[];
  readonly system: {
    readonly pendingLink: string;
    readonly languageLabel: string;
    readonly progressLabel: string;
  };
  readonly intro: {
    readonly eyebrow: string;
    readonly name: "Miquel Manzano";
    readonly role: string;
    readonly challengeLines: readonly [string, string];
    readonly availability: string;
  };
  readonly claim: {
    readonly eyebrow: string;
    readonly problemLines: readonly [string, string, string];
    readonly headingLines: readonly [string, string];
    readonly body: string;
    readonly aiPosition: string;
  };
  readonly method: {
    readonly eyebrow: string;
    readonly headingLines: readonly [string, string, string];
    readonly stages: readonly [MethodStage, MethodStage, MethodStage, MethodStage];
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
  readonly verdict: {
    readonly eyebrow: string;
    readonly headingLines: readonly [string, string];
    readonly availability: string;
    readonly emailLabel: string;
    readonly githubLabel: string;
    readonly email: ExternalDestination;
    readonly github: ExternalDestination;
  };
}
