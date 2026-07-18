import { getPortfolioContent } from "@/content/index";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

export default function EnglishPage(): React.JSX.Element {
  const content = getPortfolioContent("en");
  return <PortfolioPage content={content} />;
}
