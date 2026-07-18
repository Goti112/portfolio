import { portfolioEnglish } from "@/content/portfolio.en";
import { portfolioSpanish } from "@/content/portfolio.es";
import type { Locale, PortfolioContent } from "@/content/types";
import { validatePortfolioPair } from "@/lib/content-validation";

validatePortfolioPair(portfolioSpanish, portfolioEnglish);

export const portfolioByLocale: Readonly<Record<Locale, PortfolioContent>> = Object.freeze({
  es: portfolioSpanish,
  en: portfolioEnglish,
});

export function getPortfolioContent(locale: Locale): PortfolioContent {
  return portfolioByLocale[locale];
}
