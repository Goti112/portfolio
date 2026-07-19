import type { PortfolioContent } from "@/content/types";
import { ExternalAction } from "@/components/portfolio/ExternalAction";

interface SessionExitProps {
  readonly content: PortfolioContent["exit"];
  readonly pendingLabel: string;
}

export function SessionExit({ content, pendingLabel }: SessionExitProps): React.JSX.Element {
  return (
    <section id="contact" className="session-exit" data-motion-section="exit">
      <p className="narrative-eyebrow" data-motion-reveal>{content.eyebrow}</p>
      <h2 className="session-exit__heading" data-motion-reveal>
        {content.headingLines.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </h2>
      <p className="session-exit__availability" data-motion-reveal>{content.availability}</p>
      <div className="session-exit__actions" data-motion-reveal>
        <ExternalAction destination={content.email} label={content.emailLabel} pendingLabel={pendingLabel} />
        <ExternalAction destination={content.github} label={content.githubLabel} pendingLabel={pendingLabel} />
      </div>
    </section>
  );
}
