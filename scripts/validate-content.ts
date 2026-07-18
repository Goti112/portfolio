import { portfolioEnglish } from "../src/content/portfolio.en";
import { portfolioSpanish } from "../src/content/portfolio.es";
import { validatePortfolioPair } from "../src/lib/content-validation";

validatePortfolioPair(portfolioSpanish, portfolioEnglish);
process.stdout.write("Portfolio content is valid.\n");
