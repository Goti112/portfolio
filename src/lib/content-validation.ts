import type {
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

function methodSignature(stages: PortfolioContent["method"]["stages"]): string {
  return stages.map((stage) => stage.id).join(",");
}

function methodCapabilitySignature(stages: PortfolioContent["method"]["stages"]): string {
  return stages.map((stage) => `${stage.id}:${stage.capabilities.join(",")}`).join("|");
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

function validateNarrative(content: PortfolioContent): void {
  const locale = content.locale;
  assertNonEmpty(content.system.progressLabel, `${locale}:system.progressLabel`);
  assertNonEmpty(content.intro.role, `${locale}:intro.role`);
  for (const line of content.intro.challengeLines) assertNonEmpty(line, `${locale}:intro.challengeLines`);
  for (const line of content.claim.problemLines) assertNonEmpty(line, `${locale}:claim.problemLines`);
  for (const line of content.claim.headingLines) assertNonEmpty(line, `${locale}:claim.headingLines`);
  assertNonEmpty(content.claim.body, `${locale}:claim.body`);
  assertNonEmpty(content.claim.aiPosition, `${locale}:claim.aiPosition`);
  for (const line of content.method.headingLines) assertNonEmpty(line, `${locale}:method.headingLines`);
  for (const stage of content.method.stages) {
    assertNonEmpty(stage.label, `${locale}:method.${stage.id}.label`);
    assertNonEmpty(stage.description, `${locale}:method.${stage.id}.description`);
    for (const capability of stage.capabilities) assertNonEmpty(capability, `${locale}:method.${stage.id}.capability`);
  }
  for (const line of content.verdict.headingLines) assertNonEmpty(line, `${locale}:verdict.headingLines`);
}

function validateRequiredContent(content: PortfolioContent): void {
  const locale = content.locale;
  assertNonEmpty(content.meta.title, `${locale}:meta.title`);
  assertNonEmpty(content.meta.description, `${locale}:meta.description`);
  assertNonEmpty(content.system.pendingLink, `${locale}:system.pendingLink`);
  assertNonEmpty(content.system.languageLabel, `${locale}:system.languageLabel`);
  assertNonEmpty(content.intro.eyebrow, `${locale}:intro.eyebrow`);
  assertNonEmpty(content.intro.name, `${locale}:intro.name`);
  assertNonEmpty(content.intro.availability, `${locale}:intro.availability`);
  assertNonEmpty(content.claim.eyebrow, `${locale}:claim.eyebrow`);
  assertNonEmpty(content.method.eyebrow, `${locale}:method.eyebrow`);
  assertNonEmpty(content.projects.eyebrow, `${locale}:projects.eyebrow`);
  assertNonEmpty(content.projects.heading, `${locale}:projects.heading`);
  assertNonEmpty(content.experiments.eyebrow, `${locale}:experiments.eyebrow`);
  assertNonEmpty(content.experiments.heading, `${locale}:experiments.heading`);
  assertNonEmpty(content.education.eyebrow, `${locale}:education.eyebrow`);
  assertNonEmpty(content.education.heading, `${locale}:education.heading`);
  assertNonEmpty(content.verdict.eyebrow, `${locale}:verdict.eyebrow`);
  assertNonEmpty(content.verdict.availability, `${locale}:verdict.availability`);
  assertNonEmpty(content.verdict.emailLabel, `${locale}:verdict.emailLabel`);
  assertNonEmpty(content.verdict.githubLabel, `${locale}:verdict.githubLabel`);

  for (const item of content.navigation) {
    assertNonEmpty(item.label, `${locale}:navigation.${item.target}.label`);
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
}

export function validatePortfolioPair(spanish: PortfolioContent, english: PortfolioContent): void {
  assertCondition(spanish.locale === "es", `Expected Spanish locale, received ${spanish.locale}`);
  assertCondition(english.locale === "en", `Expected English locale, received ${english.locale}`);

  assertCondition(
    navigationSignature(spanish.navigation) === navigationSignature(english.navigation),
    "Navigation targets differ between Spanish and English content",
  );
  assertCondition(
    methodSignature(spanish.method.stages) === methodSignature(english.method.stages),
    "Method stage order differs between Spanish and English content",
  );
  assertCondition(
    methodCapabilitySignature(spanish.method.stages) === methodCapabilitySignature(english.method.stages),
    "Method capabilities differ between Spanish and English content",
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
    assertCondition(content.projects.items.length === 3, `Expected three primary projects for ${content.locale}`);
    assertCondition(content.experiments.items.length === 3, `Expected three experiments for ${content.locale}`);
    assertCondition(content.education.items.length === 2, `Expected two education items for ${content.locale}`);
    validateRequiredContent(content);
    validateNarrative(content);
    for (const project of content.projects.items) {
      validateDestination(project.repository, `${content.locale}:${project.id}`);
    }
    for (const experiment of content.experiments.items) {
      validateDestination(experiment.repository, `${content.locale}:${experiment.id}`);
    }
    validateDestination(content.verdict.email, `${content.locale}:email`);
    validateDestination(content.verdict.github, `${content.locale}:github`);
  }
}
