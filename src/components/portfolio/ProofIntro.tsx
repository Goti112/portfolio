import { ExternalAction } from "@/components/portfolio/ExternalAction";
import type { ExternalDestination, PortfolioContent } from "@/content/types";

interface ProofIntroProps {
  readonly content: PortfolioContent["intro"];
  readonly email: ExternalDestination;
  readonly pendingLabel: string;
}

export function ProofIntro({ content, email, pendingLabel }: ProofIntroProps): React.JSX.Element {
  return (
    <section id="profile" className="proof-intro" data-scene="intro">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <div className="proof-intro__body">
        <div className="proof-intro__copy">
          <h1>{content.name}</h1>
          <p className="proof-intro__role">{content.role}</p>
          <p className="proof-intro__summary">{content.summary}</p>
          <div className="proof-intro__actions">
            <a className="button button--primary" href="#projects">{content.projectsLabel}<span aria-hidden="true"> ↗</span></a>
            <ExternalAction destination={email} label={content.contactLabel} pendingLabel={pendingLabel} />
          </div>
          <p className="proof-intro__availability">{content.availability}</p>
        </div>
      </div>
    </section>
  );
}
