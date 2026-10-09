import type { PortfolioContent } from "@/content/types";
import { ProjectCaseScene } from "@/components/portfolio/ProjectCaseScene";

type ProjectEvidenceProps = PortfolioContent["projects"] & {
  readonly pendingLabel: string;
};

function channelNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function ProjectEvidence({ eyebrow, heading, labels, items, pendingLabel }: ProjectEvidenceProps): React.JSX.Element {
  return (
    <section id="projects" className="project-evidence" tabIndex={-1}>
      <p className="project-evidence__eyebrow">{eyebrow}</p>
      <h2 className="project-evidence__heading">{heading}</h2>
      <nav className="project-evidence__index" aria-label={labels.indexLabel}>
        <ol>
          {items.map((project, index) => (
            <li key={project.id}>
              <a href={`#project-${project.id}`}>
                <span className="project-evidence__index-channel" aria-hidden="true">
                  {labels.channelPrefix}.{channelNumber(index)}
                </span>
                <span>{project.name}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="project-evidence__layout">
        {items.map((project, index) => (
          <ProjectCaseScene
            key={project.id}
            project={project}
            channel={`${labels.channelPrefix}.${channelNumber(index)}`}
            labels={labels}
            pendingLabel={pendingLabel}
          />
        ))}
      </div>
    </section>
  );
}
