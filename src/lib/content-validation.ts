import type {
  CapabilityGroup,
  EducationItem,
  Experiment,
  ExternalDestination,
  NavigationItem,
  PortfolioContent,
  PrimaryProject,
} from "@/content/types";

function assertCondition(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function validateDestination(destination: ExternalDestination, context: string): void {
  if (destination.status === "pending") {
    return;
  }

  assertCondition(URL.canParse(destination.url), `Invalid destination URL for ${context}: ${destination.url}`);
  const parsedUrl = new URL(destination.url);
  assertCondition(
    ["https:", "mailto:"].includes(parsedUrl.protocol),
    `Invalid destination protocol for ${context}: ${destination.url}`,
  );
}

function assertNonEmpty(value: string, context: string): void {
  assertCondition(value.trim().length > 0, `Required content is empty for ${context}`);
}

function navigationSignature(items: readonly NavigationItem[]): string {
  return items.map((item) => item.target).join(",");
}

function capabilitySignature(groups: readonly CapabilityGroup[]): string {
  return groups.map((group) => group.items.join(",")).join("|");
}

function educationSignature(items: readonly EducationItem[]): string {
  return items
    .map((item) => `${item.abbreviation}:${item.institution}:${item.startYear}-${item.endYear}`)
    .join("|");
}

function destinationSignature(destination: ExternalDestination): string {
  return destination.status === "pending" ? "pending" : `published:${destination.url}`;
}

function projectSignature(items: readonly PrimaryProject[]): string {
  return items
    .map((project) => `${project.id}:${project.technologies.join(",")}:${destinationSignature(project.repository)}`)
    .join("|");
}

function experimentSignature(items: readonly Experiment[]): string {
  return items
    .map((experiment) => `${experiment.id}:${destinationSignature(experiment.repository)}`)
    .join("|");
}

function validateRequiredContent(content: PortfolioContent): void {
  const locale = content.locale;
  assertNonEmpty(content.meta.title, `${locale}:meta.title`);
  assertNonEmpty(content.meta.description, `${locale}:meta.description`);
  assertNonEmpty(content.system.readOnly, `${locale}:system.readOnly`);
  assertNonEmpty(content.system.pendingLink, `${locale}:system.pendingLink`);
  assertNonEmpty(content.system.languageLabel, `${locale}:system.languageLabel`);
  assertNonEmpty(content.intro.eyebrow, `${locale}:intro.eyebrow`);
  assertNonEmpty(content.intro.name, `${locale}:intro.name`);
  assertNonEmpty(content.intro.availability, `${locale}:intro.availability`);
  assertNonEmpty(content.intro.command, `${locale}:intro.command`);
  assertNonEmpty(content.identity.eyebrow, `${locale}:identity.eyebrow`);
  assertNonEmpty(content.identity.body, `${locale}:identity.body`);
  assertNonEmpty(content.identity.aiPosition, `${locale}:identity.aiPosition`);
  assertNonEmpty(content.capabilities.eyebrow, `${locale}:capabilities.eyebrow`);
  assertNonEmpty(content.capabilities.heading, `${locale}:capabilities.heading`);
  assertNonEmpty(content.projects.eyebrow, `${locale}:projects.eyebrow`);
  assertNonEmpty(content.projects.heading, `${locale}:projects.heading`);
  assertNonEmpty(content.experiments.eyebrow, `${locale}:experiments.eyebrow`);
  assertNonEmpty(content.experiments.heading, `${locale}:experiments.heading`);
  assertNonEmpty(content.education.eyebrow, `${locale}:education.eyebrow`);
  assertNonEmpty(content.education.heading, `${locale}:education.heading`);
  assertNonEmpty(content.exit.eyebrow, `${locale}:exit.eyebrow`);
  assertNonEmpty(content.exit.availability, `${locale}:exit.availability`);
  assertNonEmpty(content.exit.emailLabel, `${locale}:exit.emailLabel`);
  assertNonEmpty(content.exit.githubLabel, `${locale}:exit.githubLabel`);

  for (const item of content.navigation) {
    assertNonEmpty(item.label, `${locale}:navigation.${item.target}.label`);
  }
  for (const line of content.intro.titleLines) {
    assertNonEmpty(line, `${locale}:intro.titleLines`);
  }
  for (const line of content.identity.headingLines) {
    assertNonEmpty(line, `${locale}:identity.headingLines`);
  }
  for (const item of content.identity.evidence) {
    assertNonEmpty(item.label, `${locale}:identity.evidence.label`);
    assertNonEmpty(item.value, `${locale}:identity.evidence.value`);
  }
  for (const group of content.capabilities.groups) {
    assertNonEmpty(group.title, `${locale}:capabilities.group.title`);
    for (const item of group.items) {
      assertNonEmpty(item, `${locale}:capabilities.group.item`);
    }
  }
  for (const project of content.projects.items) {
    assertNonEmpty(project.caseLabel, `${locale}:projects.${project.id}.caseLabel`);
    assertNonEmpty(project.name, `${locale}:projects.${project.id}.name`);
    assertNonEmpty(project.summary, `${locale}:projects.${project.id}.summary`);
    for (const technology of project.technologies) {
      assertNonEmpty(technology, `${locale}:projects.${project.id}.technology`);
    }
  }
  for (const experiment of content.experiments.items) {
    assertNonEmpty(experiment.name, `${locale}:experiments.${experiment.id}.name`);
    assertNonEmpty(experiment.category, `${locale}:experiments.${experiment.id}.category`);
  }
  for (const item of content.education.items) {
    assertNonEmpty(item.qualification, `${locale}:education.${item.abbreviation}.qualification`);
    assertNonEmpty(item.institution, `${locale}:education.${item.abbreviation}.institution`);
  }
  for (const line of content.exit.headingLines) {
    assertNonEmpty(line, `${locale}:exit.headingLines`);
  }
}

export function validatePortfolioPair(spanish: PortfolioContent, english: PortfolioContent): void {
  assertCondition(spanish.locale === "es", `Expected Spanish locale, received ${spanish.locale}`);
  assertCondition(english.locale === "en", `Expected English locale, received ${english.locale}`);

  assertCondition(
    navigationSignature(spanish.navigation) === navigationSignature(english.navigation),
    "Navigation targets differ between Spanish and English content",
  );
  assertCondition(
    capabilitySignature(spanish.capabilities.groups) === capabilitySignature(english.capabilities.groups),
    "Capability values differ between Spanish and English content",
  );
  assertCondition(
    educationSignature(spanish.education.items) === educationSignature(english.education.items),
    "Education sequence differs between Spanish and English content",
  );

  assertCondition(
    projectSignature(spanish.projects.items) === projectSignature(english.projects.items),
    "Project immutable data differ between Spanish and English content",
  );
  assertCondition(
    experimentSignature(spanish.experiments.items) === experimentSignature(english.experiments.items),
    "Experiment immutable data differ between Spanish and English content",
  );

  for (const content of [spanish, english]) {
    assertCondition(content.navigation.length === 5, `Expected five navigation items for ${content.locale}`);
    assertCondition(content.capabilities.groups.length === 3, `Expected three capability groups for ${content.locale}`);
    assertCondition(content.projects.items.length === 3, `Expected three primary projects for ${content.locale}`);
    assertCondition(content.experiments.items.length === 3, `Expected three experiments for ${content.locale}`);
    assertCondition(content.education.items.length === 2, `Expected two education items for ${content.locale}`);
    validateRequiredContent(content);
    for (const project of content.projects.items) {
      validateDestination(project.repository, `${content.locale}:${project.id}`);
    }
    for (const experiment of content.experiments.items) {
      validateDestination(experiment.repository, `${content.locale}:${experiment.id}`);
    }
    validateDestination(content.exit.email, `${content.locale}:email`);
    validateDestination(content.exit.github, `${content.locale}:github`);
  }
}
