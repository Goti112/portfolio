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

const methodCapabilityMismatch: PortfolioContent = {
  ...portfolioEnglish,
  method: {
    ...portfolioEnglish.method,
    stages: [
      {
        ...portfolioEnglish.method.stages[0],
        capabilities: [...portfolioEnglish.method.stages[0].capabilities, "Rust"],
      },
      portfolioEnglish.method.stages[1],
      portfolioEnglish.method.stages[2],
      portfolioEnglish.method.stages[3],
    ],
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

const methodStageMismatch: PortfolioContent = {
  ...portfolioEnglish,
  method: {
    ...portfolioEnglish.method,
    stages: [
      { ...portfolioEnglish.method.stages[0], id: "ship" },
      portfolioEnglish.method.stages[1],
      portfolioEnglish.method.stages[2],
      portfolioEnglish.method.stages[3],
    ],
  },
};

const emptyVerdict: PortfolioContent = {
  ...portfolioEnglish,
  verdict: {
    ...portfolioEnglish.verdict,
    headingLines: ["", portfolioEnglish.verdict.headingLines[1]],
  },
};

assert.throws(
  () => validatePortfolioPair(portfolioSpanish, navigationMismatch),
  /Navigation targets differ between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, methodCapabilityMismatch),
  /Method capabilities differ between Spanish and English content/,
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
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, methodStageMismatch),
  /Method stage order differs between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, emptyVerdict),
  /Required content is empty for en:verdict.headingLines/,
);

process.stdout.write("Content validation contract is enforced.\n");
