import { ExternalAction } from "@/components/portfolio/ExternalAction";
import type { Experiment } from "@/content/types";

interface ExperimentMontageProps {
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly Experiment[];
  readonly pendingLabel: string;
}

export function ExperimentMontage({ eyebrow, heading, items, pendingLabel }: ExperimentMontageProps): React.JSX.Element {
  return (
    <section className="experiment-montage" data-scene="experiments" data-motion-section="experiments">
      <p className="experiment-montage__eyebrow">{eyebrow}</p>
      <h2 className="experiment-montage__heading" data-motion-reveal>{heading}</h2>
      <div className="experiment-montage__stage" data-experiment-stage>
        <div className="experiment-montage__strip" data-experiment-strip>
          {items.map((experiment) => (
            <article key={experiment.id} className="experiment-montage__item" data-motion-reveal data-experiment-card>
              <span className="experiment-montage__case-id">{experiment.id}</span>
              <h3 className="experiment-montage__name">{experiment.name}</h3>
              <span className="experiment-montage__category">{experiment.category}</span>
              <ExternalAction destination={experiment.repository} label={experiment.name} pendingLabel={pendingLabel} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
