import { ExternalAction } from "@/components/portfolio/ExternalAction";
import type { PortfolioContent } from "@/content/types";

interface ProofVerdictProps {
  readonly content: PortfolioContent["verdict"];
  readonly pendingLabel: string;
}

export function ProofVerdict({ content, pendingLabel }: ProofVerdictProps): React.JSX.Element {
  return (
    <section id="contact" className="proof-verdict" data-scene="verdict">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <h2 data-motion-heading data-motion-reveal>
        {content.headingLines.map((line) => <span key={line}>{line}</span>)}
      </h2>
      <p className="proof-verdict__availability">{content.availability}</p>
      <div className="proof-verdict__actions" data-motion-reveal>
        <ExternalAction destination={content.email} label={content.emailLabel} pendingLabel={pendingLabel} />
        <ExternalAction destination={content.github} label={content.githubLabel} pendingLabel={pendingLabel} />
      </div>
    </section>
  );
}
