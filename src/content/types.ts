export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];
export type PrimaryProjectId = "qgc-planner" | "borderpass-ai" | "ticket-ocr";
export type FutureProjectId = "future-project-01" | "future-project-02" | "future-project-03";
export type MethodStageId = "languages" | "web" | "data-applications" | "quality";

export type ExternalDestination =
  | { readonly status: "pending" }
  | { readonly status: "published"; readonly url: string };

export interface NavigationItem {
  readonly label: string;
  readonly target: "projects" | "capabilities" | "education" | "contact";
}

export interface PrimaryProject {
  readonly id: PrimaryProjectId;
  readonly name: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly technologies: readonly string[];
  readonly tooling: readonly string[];
  readonly repository: ExternalDestination;
}

export interface Experiment {
  readonly id: FutureProjectId;
  readonly marker: "?";
  readonly ariaLabel: string;
}

export interface EducationItem {
  readonly qualification: string;
  readonly level: string;
  readonly abbreviation: "SMX" | "DAW" | "DAM";
  readonly institution: "Institut Bernat el Ferrer" | "Institut Gabriela Mistral";
  readonly startYear: number;
  readonly endYear: number | null;
  readonly internship?: EducationInternship;
}

export interface EducationInternship {
  readonly label: string;
  readonly period: string;
  readonly startMonth: `${number}-${number}`;
  readonly endMonth: `${number}-${number}`;
  readonly description: string;
  readonly technologies: readonly string[];
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
    readonly header: {
      readonly broadcastLabel: string;
      readonly channelPrefix: string;
      readonly homeChannelLabel: string;
      readonly currentChannelLabel: string;
      readonly navigationLabel: string;
      readonly skipLabel: string;
      readonly languageTargetLabel: string;
    };
  };
  readonly intro: {
    readonly eyebrow: string;
    readonly name: "Miquel Manzano";
    readonly role: string;
    readonly summary: string;
    readonly availability: string;
    readonly projectsLabel: string;
    readonly contactLabel: string;
  };
  readonly method: {
    readonly terminal: {
      readonly channelPrefix: string;
      readonly nodesLabel: string;
      readonly linkedLabel: string;
      readonly legendPrefix: string;
      readonly legendLink: string;
      readonly linkedDescription: string;
      readonly carrier: string;
      readonly sideNote: string;
    };
    readonly eyebrow: string;
    readonly heading: string;
    readonly stages: readonly [MethodStage, MethodStage, MethodStage, MethodStage];
  };
  readonly projects: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly labels: {
      readonly channelPrefix: string;
      readonly indexLabel: string;
      readonly summaryLabel: string;
      readonly highlightsLabel: string;
      readonly stackLabel: string;
    };
    readonly items: readonly PrimaryProject[];
  };
  readonly education: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly currentLabel: string;
    readonly traceLabel: string;
    readonly items: readonly EducationItem[];
  };
  readonly contact: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly emailLabel: string;
    readonly githubLabel: string;
    readonly lead: string;
    readonly statusLabel: string;
    readonly availability: string;
    readonly details: readonly { readonly label: string; readonly value: string }[];
    readonly copyLabel: string;
    readonly copiedLabel: string;
    readonly closing: string;
    readonly email: ExternalDestination;
    readonly github: ExternalDestination;
  };
}
