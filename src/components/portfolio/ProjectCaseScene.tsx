import { ExternalAction } from "@/components/portfolio/ExternalAction";
import type { PrimaryProject } from "@/content/types";

interface ProjectCaseSceneProps {
  readonly project: PrimaryProject;
  readonly pendingLabel: string;
  readonly preview: () => React.JSX.Element;
}

export function ProjectCaseScene({ project, pendingLabel, preview: Preview }: ProjectCaseSceneProps): React.JSX.Element {
  return (
    <article
      className="project-evidence__item"
      data-project-case={project.id}
      data-project-id={project.id}
      data-motion-reveal
      data-probe
    >
      <div className="project-evidence__text">
        <span className="project-evidence__case-label">{project.caseLabel}</span>
        <h3 className="project-evidence__name">{project.name}</h3>
        <p className="project-evidence__summary">{project.summary}</p>
        <ul className="project-evidence__techs">
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <ExternalAction destination={project.repository} label={project.name} pendingLabel={pendingLabel} />
      </div>
      <div className="project-evidence__preview" data-project-inline-preview={project.id}>
        <Preview />
      </div>
    </article>
  );
}
