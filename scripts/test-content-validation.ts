import assert from "node:assert/strict";
import { portfolioEnglish } from "../src/content/portfolio.en";
import { portfolioSpanish } from "../src/content/portfolio.es";
import type { PortfolioContent } from "../src/content/types";
import { validatePortfolioPair } from "../src/lib/content-validation";

const navigationMismatch: PortfolioContent = {
  ...portfolioEnglish,
  navigation: [
    ...portfolioEnglish.navigation.slice(1, 2),
    ...portfolioEnglish.navigation.slice(0, 1),
    ...portfolioEnglish.navigation.slice(2),
  ],
};

const capabilityMismatch: PortfolioContent = {
  ...portfolioEnglish,
  capabilities: {
    ...portfolioEnglish.capabilities,
    groups: portfolioEnglish.capabilities.groups.slice(0, -1),
  },
};

const educationMismatch: PortfolioContent = {
  ...portfolioEnglish,
  education: {
    ...portfolioEnglish.education,
    items: portfolioEnglish.education.items.slice(0, -1),
  },
};

const projectTechnologyMismatch: PortfolioContent = {
  ...portfolioEnglish,
  projects: {
    ...portfolioEnglish.projects,
    items: portfolioEnglish.projects.items.map((project, index) => index === 0
      ? { ...project, technologies: [...project.technologies, "Rust"] }
      : project),
  },
};

const experimentDestinationMismatch: PortfolioContent = {
  ...portfolioEnglish,
  experiments: {
    ...portfolioEnglish.experiments,
    items: portfolioEnglish.experiments.items.map((experiment, index) => index === 0
      ? { ...experiment, repository: { status: "published", url: "https://example.com/project" } }
      : experiment),
  },
};

const emptyMetadata: PortfolioContent = {
  ...portfolioEnglish,
  meta: {
    ...portfolioEnglish.meta,
    title: "   ",
  },
};

assert.throws(
  () => validatePortfolioPair(portfolioSpanish, navigationMismatch),
  /Navigation targets differ between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, capabilityMismatch),
  /Capability values differ between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, educationMismatch),
  /Education sequence differs between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, projectTechnologyMismatch),
  /Project immutable data differ between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, experimentDestinationMismatch),
  /Experiment immutable data differ between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, emptyMetadata),
  /Required content is empty for en:meta.title/,
);

process.stdout.write("Content validation contract is enforced.\n");
