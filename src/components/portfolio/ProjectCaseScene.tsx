import { ExternalAction } from "@/components/portfolio/ExternalAction";
import { ProjectScreenshot } from "@/components/portfolio/ProjectScreenshot";
import type { PortfolioContent, PrimaryProject } from "@/content/types";

interface ProjectCaseSceneProps {
  readonly project: PrimaryProject;
  readonly channel: string;
  readonly labels: PortfolioContent["projects"]["labels"];
  readonly pendingLabel: string;
}

export function ProjectCaseScene({ project, channel, labels, pendingLabel }: ProjectCaseSceneProps): React.JSX.Element {
  const titleId = `project-${project.id}-title`;

  return (
    <article
      id={`project-${project.id}`}
      className="project-evidence__item"
      data-project-case={project.id}
      data-project-id={project.id}
      aria-labelledby={titleId}
    >
      <header className="project-evidence__bar" aria-hidden="true">
        <span className="project-evidence__case-label">{channel} {"//"}</span>
        <span className="project-evidence__bar-name">{project.name}</span>
        <span className="project-evidence__rec">● REC</span>
      </header>
      <div className="project-evidence__body">
        <div className="project-evidence__preview" data-project-inline-preview={project.id}>
          <ProjectScreenshot screenshot={project.screenshot} sourceLabel={labels.sourceLabel} enlargeLabel={labels.enlargeLabel} closeLabel={labels.closeLabel} />
        </div>
        <div className="project-evidence__text">
          <h3 id={titleId} className="project-evidence__name">{project.name}</h3>
          <dl className="project-evidence__facts">
            <div>
              <dt>{labels.summaryLabel}</dt>
              <dd className="project-evidence__summary">{project.summary}</dd>
            </div>
            <div>
              <dt>{labels.highlightsLabel}</dt>
              <dd>
                <ul className="project-evidence__highlights">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>{labels.stackLabel}</dt>
              <dd>
                <ul className="project-evidence__techs">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <ExternalAction destination={project.repository} label={project.name} pendingLabel={pendingLabel} />
        </div>
      </div>
    </article>
  );
}
