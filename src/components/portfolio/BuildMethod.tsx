import type { PortfolioContent } from "@/content/types";

interface BuildMethodProps {
  readonly method: PortfolioContent["method"];
}

export function BuildMethod({ method }: BuildMethodProps): React.JSX.Element {
  return (
    <section id="capabilities" className="build-method">
      <p className="scene-eyebrow">{method.eyebrow}</p>
      <h2 data-motion-section>{method.heading}</h2>
      <div className="build-method__stages">
        {method.stages.map((stage) => (
          <article key={stage.id} className="build-method__stage" data-method-stage={stage.id}>
            <h3>{stage.label}</h3>
            <p>{stage.description}</p>
            <ul>
              {stage.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
