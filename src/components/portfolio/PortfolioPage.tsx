import type { PortfolioContent } from "@/content/types";
import { BuildMethod } from "@/components/portfolio/BuildMethod";
import { EvidenceLens } from "@/components/portfolio/EvidenceLens";
import { ExecutionClaim } from "@/components/portfolio/ExecutionClaim";
import { ExperienceHeader } from "@/components/portfolio/ExperienceHeader";
import { ProjectEvidence } from "@/components/portfolio/ProjectEvidence";
import { ProofIntro } from "@/components/portfolio/ProofIntro";
import { ProofVerdict } from "@/components/portfolio/ProofVerdict";
import { RecoveredFiles } from "@/components/portfolio/RecoveredFiles";

interface PortfolioPageProps {
  readonly content: PortfolioContent;
}

export function PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element {
  return (
    <div className="portfolio-shell" data-motion-root data-motion-state="static">
      <ExperienceHeader content={content} />
      <main id="main-content">
        <ProofIntro content={content.intro} />
        <ExecutionClaim content={content.claim} />
        <BuildMethod method={content.method} education={content.education} />
        <ProjectEvidence {...content.projects} pendingLabel={content.system.pendingLink} />
        <RecoveredFiles {...content.experiments} pendingLabel={content.system.pendingLink} />
        <ProofVerdict content={content.verdict} pendingLabel={content.system.pendingLink} />
      </main>
      <EvidenceLens />
    </div>
  );
}
