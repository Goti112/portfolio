import type { PortfolioContent } from "@/content/types";
import { PortfolioExperienceRoot } from "@/components/motion/MotionExperience";
import { BuildMethod } from "@/components/portfolio/BuildMethod";
import { EvidenceLens } from "@/components/portfolio/EvidenceLens";
import { ExperimentMontage } from "@/components/portfolio/ExperimentMontage";
import { ExecutionClaim } from "@/components/portfolio/ExecutionClaim";
import { ExperienceHeader } from "@/components/portfolio/ExperienceHeader";
import { ProjectEvidence } from "@/components/portfolio/ProjectEvidence";
import { ProofIntro } from "@/components/portfolio/ProofIntro";
import { ProofVerdict } from "@/components/portfolio/ProofVerdict";

interface PortfolioPageProps {
  readonly content: PortfolioContent;
}

export function PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element {
  return (
    <PortfolioExperienceRoot>
      <ExperienceHeader content={content} />
      <main id="main-content" tabIndex={-1}>
        <ProofIntro content={content.intro} />
        <ExecutionClaim content={content.claim} />
        <BuildMethod method={content.method} education={content.education} />
        <ProjectEvidence {...content.projects} pendingLabel={content.system.pendingLink} />
        <ExperimentMontage {...content.experiments} pendingLabel={content.system.pendingLink} />
        <ProofVerdict content={content.verdict} pendingLabel={content.system.pendingLink} />
      </main>
      <EvidenceLens />
    </PortfolioExperienceRoot>
  );
}
