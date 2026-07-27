import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioContent } from "@/content/index";

export default function EnglishPage(): React.JSX.Element {
  return <PortfolioPage content={getPortfolioContent("en")} />;
}
