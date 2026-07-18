import type { PortfolioContent } from "@/content/types";

interface CapabilityAnalysisProps {
  readonly content: PortfolioContent["capabilities"];
}

export function CapabilityAnalysis({ content }: CapabilityAnalysisProps): React.JSX.Element {
  return (
    <section id="capabilities" className="capability-analysis" data-motion-section="capabilities">
      <h2 className="capability-analysis__heading">{content.heading}</h2>
      {content.groups.map((group) => (
        <article key={group.title} className="capability-analysis__group">
          <h3 className="capability-analysis__group-title">{group.title}</h3>
          <ul className="capability-analysis__list">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
