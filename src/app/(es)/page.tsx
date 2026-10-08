import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioContent } from "@/content/index";

export default function SpanishPage(): React.JSX.Element {
  return <PortfolioPage content={getPortfolioContent("es")} />;
}
