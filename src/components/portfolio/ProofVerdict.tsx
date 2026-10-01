import { ExternalAction } from "@/components/portfolio/ExternalAction";
import type { PortfolioContent } from "@/content/types";

interface ProofVerdictProps {
  readonly content: PortfolioContent["contact"];
  readonly pendingLabel: string;
}

export function ProofVerdict({ content, pendingLabel }: ProofVerdictProps): React.JSX.Element {
  return (
    <section id="contact" className="proof-verdict">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <h2 data-motion-section>{content.heading}</h2>
      <div className="proof-verdict__actions">
        <ExternalAction destination={content.email} label={content.emailLabel} pendingLabel={pendingLabel} />
        <ExternalAction destination={content.github} label={content.githubLabel} pendingLabel={pendingLabel} />
      </div>
    </section>
  );
}
