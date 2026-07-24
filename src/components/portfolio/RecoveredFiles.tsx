import type { Experiment } from "@/content/types";
import { ExternalAction } from "@/components/portfolio/ExternalAction";

interface RecoveredFilesProps {
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly Experiment[];
  readonly pendingLabel: string;
}

export function RecoveredFiles({ eyebrow, heading, items, pendingLabel }: RecoveredFilesProps): React.JSX.Element {
  return (
    <section className="recovered-files" data-scene="experiments" data-section="experiments" data-motion-section="experiments">
      <p className="recovered-files__eyebrow">{eyebrow}</p>
      <h2 className="recovered-files__heading" data-motion-reveal>{heading}</h2>
      <div className="recovered-files__list">
        {items.map((experiment) => (
          <article key={experiment.id} className="recovered-files__item" data-motion-reveal>
            <span className="recovered-files__case-id">{experiment.id}</span>
            <h3 className="recovered-files__name">{experiment.name}</h3>
            <span className="recovered-files__category">{experiment.category}</span>
            <ExternalAction destination={experiment.repository} label={experiment.name} pendingLabel={pendingLabel} />
          </article>
        ))}
      </div>
    </section>
  );
}
