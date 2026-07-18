import type { PortfolioContent } from "@/content/types";

interface IdentityTraceProps {
  readonly content: PortfolioContent["identity"];
}

export function IdentityTrace({ content }: IdentityTraceProps): React.JSX.Element {
  return (
    <section className="identity-trace" data-motion-section="identity">
      <h2 className="identity-trace__heading" data-motion-reveal>
        {content.headingLines.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </h2>
      <p className="identity-trace__body" data-motion-reveal>{content.body}</p>
      <p className="identity-trace__ai-position" data-motion-reveal>{content.aiPosition}</p>
      <dl className="identity-trace__evidence">
        {content.evidence.map((item) => (
          <div key={item.label} className="identity-trace__evidence-row" data-motion-reveal>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
