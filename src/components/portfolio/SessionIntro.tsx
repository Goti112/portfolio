import type { PortfolioContent } from "@/content/types";

interface SessionIntroProps {
  readonly content: PortfolioContent["intro"];
}

export function SessionIntro({ content }: SessionIntroProps): React.JSX.Element {
  return (
    <section id="profile" className="session-intro" data-motion-section="intro">
      <h1 className="sr-only">{content.name}</h1>
      <div className="session-intro__titles" aria-hidden="true">
        {content.titleLines.map((line, i) => (
          <span key={i} className="session-intro__title">{line}</span>
        ))}
      </div>
      <p className="session-intro__availability">{content.availability}</p>
      <pre className="session-intro__command" aria-hidden="true">{content.command}</pre>
    </section>
  );
}
