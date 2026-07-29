import type { Experiment } from "@/content/types";

interface ExperimentMontageProps {
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly Experiment[];
}

export function ExperimentMontage({ eyebrow, heading, items }: ExperimentMontageProps): React.JSX.Element {
  return (
    <section className="experiment-montage" data-scene="experiments" data-motion-section="experiments">
      <p className="experiment-montage__eyebrow">{eyebrow}</p>
      <h2 className="experiment-montage__heading" data-motion-reveal>{heading}</h2>
      <div className="experiment-montage__stage" data-experiment-stage>
        <div
          className="experiment-montage__strip"
          data-experiment-strip
          role="region"
          aria-label={heading}
          tabIndex={0}
        >
          {items.map((experiment) => (
            <article
              key={experiment.id}
              aria-label={experiment.ariaLabel}
              className="experiment-montage__item"
              data-motion-reveal
              data-experiment-card
            >
              <span aria-hidden="true" className="experiment-montage__placeholder">{experiment.marker}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
