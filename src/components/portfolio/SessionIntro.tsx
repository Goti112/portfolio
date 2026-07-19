import type { PortfolioContent } from "@/content/types";

interface SessionIntroProps {
  readonly content: PortfolioContent["intro"];
}

export function SessionIntro({ content }: SessionIntroProps): React.JSX.Element {
  return (
    <section id="profile" className="session-intro" data-motion-section="intro">
      <p className="narrative-eyebrow" data-motion-reveal>{content.eyebrow}</p>
      <h1 className="session-intro__name" data-motion-reveal>{content.name}</h1>
      <div className="session-intro__titles" aria-hidden="true">
        {content.titleLines.map((line, i) => (
          <span key={i} className="session-intro__title" data-motion-reveal>{line}</span>
        ))}
      </div>
      <p className="session-intro__availability" data-motion-reveal>{content.availability}</p>
      <pre className="session-intro__command" aria-hidden="true" data-motion-reveal>{content.command}</pre>
    </section>
  );
}
