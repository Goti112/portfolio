import type { PortfolioContent } from "@/content/types";
import { SessionNavigation } from "@/components/portfolio/SessionNavigation";
import { SessionIntro } from "@/components/portfolio/SessionIntro";
import { IdentityTrace } from "@/components/portfolio/IdentityTrace";
import { CapabilityAnalysis } from "@/components/portfolio/CapabilityAnalysis";
import { EducationLog } from "@/components/portfolio/EducationLog";
import { SessionExit } from "@/components/portfolio/SessionExit";
import { ProjectEvidence } from "@/components/portfolio/ProjectEvidence";
import { RecoveredFiles } from "@/components/portfolio/RecoveredFiles";
import { MotionController } from "@/components/motion/MotionController";
import { ForensicCursor } from "@/components/motion/ForensicCursor";

interface PortfolioPageProps {
  readonly content: PortfolioContent;
}

export function PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element {
  return (
    <div className="portfolio-shell" data-motion-root>
      <MotionController />
      <ForensicCursor />
      <div className="portfolio-shell__corruption-line" data-corruption-line aria-hidden="true" />
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
        <ProjectEvidence
          eyebrow={content.projects.eyebrow}
          heading={content.projects.heading}
          items={content.projects.items}
          pendingLabel={content.system.pendingLink}
        />
        <RecoveredFiles
          eyebrow={content.experiments.eyebrow}
          heading={content.experiments.heading}
          items={content.experiments.items}
          pendingLabel={content.system.pendingLink}
        />
        <EducationLog content={content.education} />
        <SessionExit content={content.exit} pendingLabel={content.system.pendingLink} />
      </main>
    </div>
  );
}
