import { getPortfolioContent } from "@/content/index";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

export default function SpanishPage(): React.JSX.Element {
  const content = getPortfolioContent("es");
  return <PortfolioPage content={content} />;
}
