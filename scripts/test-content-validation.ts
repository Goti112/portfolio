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
      { ...portfolioEnglish.method.stages[0], id: "quality" },
      portfolioEnglish.method.stages[1],
      portfolioEnglish.method.stages[2],
      portfolioEnglish.method.stages[3],
    ],
  },
};

const emptyContact: PortfolioContent = {
  ...portfolioEnglish,
  contact: {
    ...portfolioEnglish.contact,
    heading: "",
  },
};

const terminalFields = {
  channelPrefix: "CH",
  nodesLabel: "NODOS",
  linkedLabel: "LINKED",
  legendPrefix: "used in shipped projects",
  legendLink: "See projects ↓",
  linkedDescription: "usada en proyectos",
  carrier: "NO CARRIER → CONECTADO",
  sideNote: "PRESENT DAY, PRESENT TIME",
} as const;
const terminalFieldNames = [
  "channelPrefix",
  "nodesLabel",
  "linkedLabel",
  "legendPrefix",
  "legendLink",
  "linkedDescription",
  "carrier",
  "sideNote",
] as const;

const headerFields = {
  broadcastLabel: "REC",
  channelPrefix: "CH",
  homeChannelLabel: "PROFILE",
  currentChannelLabel: "Current section",
  navigationLabel: "Main navigation",
  skipLabel: "Skip to content",
  languageTargetLabel: "Español",
} as const;
const headerFieldNames = [
  "broadcastLabel",
  "channelPrefix",
  "homeChannelLabel",
  "currentChannelLabel",
  "navigationLabel",
  "skipLabel",
  "languageTargetLabel",
] as const;

for (const field of headerFieldNames) {
  const invalidHeaderContent = {
    ...portfolioEnglish,
    system: { ...portfolioEnglish.system, header: { ...headerFields, [field]: "" } },
  };
  assert.throws(
    () => validatePortfolioPair(portfolioSpanish, invalidHeaderContent),
    new RegExp("Required content is empty for en:system.header." + field),
  );
}

for (const field of terminalFieldNames) {
  const invalidTerminalContent = {
    ...portfolioEnglish,
    method: {
      ...portfolioEnglish.method,
      terminal: { ...terminalFields, [field]: "" },
    },
  };
  assert.throws(
    () => validatePortfolioPair(portfolioSpanish, invalidTerminalContent),
    new RegExp(`Required content is empty for en:method.terminal.${field}`),
  );
}

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
  () => validatePortfolioPair(portfolioSpanish, emptyMetadata),
  /Required content is empty for en:meta.title/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, methodStageMismatch),
  /Method stage order differs between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, emptyContact),
  /Required content is empty for en:contact.heading/,
);

process.stdout.write("Content validation contract is enforced.\n");
