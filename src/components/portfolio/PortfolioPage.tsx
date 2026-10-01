import type { PortfolioContent } from "@/content/types";
import { PortfolioExperienceRoot } from "@/components/motion/MotionExperience";
import { BuildMethod } from "@/components/portfolio/BuildMethod";
import { ExperienceHeader } from "@/components/portfolio/ExperienceHeader";
import { FormationTrace } from "@/components/portfolio/FormationTrace";
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
        <ProofIntro content={content.intro} email={content.contact.email} pendingLabel={content.system.pendingLink} />
        <ProjectEvidence {...content.projects} pendingLabel={content.system.pendingLink} />
        <BuildMethod method={content.method} />
        <FormationTrace content={content.education} />
        <ProofVerdict content={content.contact} pendingLabel={content.system.pendingLink} />
      </main>
    </PortfolioExperienceRoot>
  );
}
