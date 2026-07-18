import type { PortfolioContent } from "@/content/types";
import { SessionNavigation } from "@/components/portfolio/SessionNavigation";
import { SessionIntro } from "@/components/portfolio/SessionIntro";
import { IdentityTrace } from "@/components/portfolio/IdentityTrace";
import { CapabilityAnalysis } from "@/components/portfolio/CapabilityAnalysis";
import { EducationLog } from "@/components/portfolio/EducationLog";
import { SessionExit } from "@/components/portfolio/SessionExit";

interface PortfolioPageProps {
  readonly content: PortfolioContent;
}

export function PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element {
  return (
    <div className="portfolio-shell">
      <SessionNavigation
        locale={content.locale}
        items={content.navigation}
        languageLabel={content.system.languageLabel}
        readOnlyLabel={content.system.readOnly}
      />
      <main>
        <SessionIntro content={content.intro} />
        <IdentityTrace content={content.identity} />
        <CapabilityAnalysis content={content.capabilities} />
        <div id="projects" className="project-story-anchor" />
        <EducationLog content={content.education} />
        <SessionExit content={content.exit} pendingLabel={content.system.pendingLink} />
      </main>
    </div>
  );
}
