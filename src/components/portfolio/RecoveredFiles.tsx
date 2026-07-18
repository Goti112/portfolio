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
    <section className="recovered-files" data-section="experiments" data-motion-section="experiments">
      <h2 className="recovered-files__eyebrow">{eyebrow}</h2>
      <h3 className="recovered-files__heading">{heading}</h3>
      <div className="recovered-files__list">
        {items.map((experiment) => (
          <article key={experiment.id} className="recovered-files__item">
            <span className="recovered-files__case-id">{experiment.id}</span>
            <h4 className="recovered-files__name">{experiment.name}</h4>
            <span className="recovered-files__category">{experiment.category}</span>
            <ExternalAction destination={experiment.repository} label={experiment.id} pendingLabel={pendingLabel} />
          </article>
        ))}
      </div>
    </section>
  );
}
