import type { PortfolioContent } from "@/content/types";

interface ExecutionClaimProps {
  readonly content: PortfolioContent["claim"];
}

export function ExecutionClaim({ content }: ExecutionClaimProps): React.JSX.Element {
  return (
    <section className="execution-claim" data-scene="claim">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <div className="execution-claim__fragments" aria-hidden="true">
        {content.problemLines.map((line) => <span key={line} data-claim-fragment>{line}</span>)}
      </div>
      <h2 data-motion-heading data-motion-reveal>
        {content.headingLines.map((line) => <span key={line}>{line}</span>)}
      </h2>
      <p data-motion-reveal>{content.body}</p>
      <p className="execution-claim__ai" data-motion-reveal>{content.aiPosition}</p>
    </section>
  );
}
