import type { PortfolioContent } from "@/content/types";

interface ProofIntroProps {
  readonly content: PortfolioContent["intro"];
}

export function ProofIntro({ content }: ProofIntroProps): React.JSX.Element {
  return (
    <section id="profile" className="proof-intro" data-scene="intro">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <h1>{content.name}</h1>
      <p className="proof-intro__role">{content.role}</p>
      <div className="proof-intro__challenge" data-motion-heading data-motion-reveal>
        {content.challengeLines.map((line) => <span key={line}>{line}</span>)}
      </div>
      <p className="proof-intro__availability">{content.availability}</p>
      <div className="proof-intro__evidence-window" data-intro-window aria-hidden="true" />
      <div className="proof-intro__scan" data-intro-scan aria-hidden="true" />
    </section>
  );
}
