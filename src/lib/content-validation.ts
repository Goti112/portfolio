import type { ExternalDestination, PortfolioContent } from "@/content/types";

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

export function validatePortfolioPair(spanish: PortfolioContent, english: PortfolioContent): void {
  assertCondition(spanish.locale === "es", `Expected Spanish locale, received ${spanish.locale}`);
  assertCondition(english.locale === "en", `Expected English locale, received ${english.locale}`);

  const spanishProjectIds = spanish.projects.items.map((project) => project.id).join(",");
  const englishProjectIds = english.projects.items.map((project) => project.id).join(",");
  assertCondition(spanishProjectIds === englishProjectIds, "Project IDs differ between Spanish and English content");

  const spanishExperimentIds = spanish.experiments.items.map((experiment) => experiment.id).join(",");
  const englishExperimentIds = english.experiments.items.map((experiment) => experiment.id).join(",");
  assertCondition(spanishExperimentIds === englishExperimentIds, "Experiment IDs differ between Spanish and English content");

  for (const content of [spanish, english]) {
    assertCondition(content.navigation.length === 5, `Expected five navigation items for ${content.locale}`);
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
