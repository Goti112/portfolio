import { FormationTrace } from "@/components/portfolio/FormationTrace";
import type { PortfolioContent } from "@/content/types";

interface BuildMethodProps {
  readonly method: PortfolioContent["method"];
  readonly education: PortfolioContent["education"];
}

export function BuildMethod({ method, education }: BuildMethodProps): React.JSX.Element {
  return (
    <section id="capabilities" className="build-method" data-scene="method">
      <p className="scene-eyebrow">{method.eyebrow}</p>
      <h2 data-motion-heading>
        {method.headingLines.map((line) => <span key={line}>{line}</span>)}
      </h2>
      <div className="build-method__stages">
        {method.stages.map((stage) => (
          <article key={stage.id} className="build-method__stage" data-method-stage={stage.id} data-motion-reveal>
            <h3>{stage.label}</h3>
            <p>{stage.description}</p>
            <ul>
              {stage.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <svg
        className="build-method__connectors"
        viewBox="0 0 400 20"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path data-method-connector d="M 50 10 H 150" />
        <path data-method-connector d="M 150 10 H 250" />
        <path data-method-connector d="M 250 10 H 350" />
      </svg>
      <FormationTrace content={education} />
    </section>
  );
}
