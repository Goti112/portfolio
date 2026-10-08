import type { PortfolioContent } from "@/content/types";
import { linkedTechnologies } from "@/lib/linked-technologies";
import { WiredReveal } from "@/components/portfolio/WiredReveal";

interface BuildMethodProps {
  readonly method: PortfolioContent["method"];
  readonly projects: PortfolioContent["projects"]["items"];
}

export function BuildMethod({ method, projects }: BuildMethodProps): React.JSX.Element {
  const t = method.terminal;
  const linkedSet = linkedTechnologies(projects);

  return (
    <section id="capabilities" className="build-method" tabIndex={-1}>
      <p className="build-method__carrier" aria-hidden="true">
        {t.carrier}
      </p>
      <p className="build-method__side-note" aria-hidden="true">
        {t.sideNote}
      </p>
      <p className="scene-eyebrow">{method.eyebrow}</p>
      <h2 className="build-method__title" data-text={method.heading} aria-label={method.heading}>
        {method.heading}
      </h2>
      <p className="build-method__legend">
        <span className="build-method__status" aria-hidden="true">[{t.linkedLabel}]</span>
        {" = "}{t.legendPrefix}
        {" · "}<a href="#projects">{t.legendLink}</a>
      </p>
      <div className="build-method__stages">
        {method.stages.map((stage, index) => (
          <article key={stage.id} className="build-method__stage" data-method-stage={stage.id}>
            <header className="build-method__stage-header">
              <span className="build-method__channel" aria-hidden="true">
                {t.channelPrefix}-{String(index + 1).padStart(2, "0")}{" //"}
              </span>
              <h3>{stage.label}</h3>
              <span className="build-method__count" aria-hidden="true">
                {String(stage.capabilities.length).padStart(2, "0")}
                <span className="build-method__count-label"> {t.nodesLabel}</span>
              </span>
            </header>
            <p>{stage.description}</p>
            <ul className="build-method__nodes">
              {stage.capabilities.map((capability, nodeIndex) => {
                const linked = linkedSet.has(capability.toLowerCase());
                return (
                  <li
                    key={capability}
                    className="build-method__node"
                    data-linked={linked}
                    style={{ "--node-index": nodeIndex } as React.CSSProperties}
                  >
                    <span className="build-method__prompt" aria-hidden="true">
                      &gt;
                    </span>
                    <span className="build-method__name">{capability}</span>
                    <span className="build-method__ext" aria-hidden="true">
                      .node
                    </span>
                    {linked ? (
                      <>
                        <span className="build-method__leader" aria-hidden="true" />
                        <span className="build-method__status" aria-hidden="true">[{t.linkedLabel}]</span>
                        <span className="sr-only">, {t.linkedDescription}</span>
                      </>
                    ) : null}
                  </li>
                );
              })}
            <li className="build-method__prompt-line" role="presentation" aria-hidden="true">
              <span className="build-method__prompt" aria-hidden="true">
                &gt;
              </span>
              <span className="build-method__cursor">_</span>
            </li>
            </ul>
          </article>
        ))}
      </div>
      <WiredReveal targetId="capabilities" />
    </section>
  );
}
