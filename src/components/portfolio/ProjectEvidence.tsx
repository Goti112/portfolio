import type { PrimaryProject, PrimaryProjectId } from "@/content/types";
import { ExternalAction } from "@/components/portfolio/ExternalAction";
import { QgcPreview } from "@/components/previews/QgcPreview";
import { BorderPassPreview } from "@/components/previews/BorderPassPreview";
import { OcrPreview } from "@/components/previews/OcrPreview";

interface ProjectEvidenceProps {
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly PrimaryProject[];
  readonly pendingLabel: string;
}

const previewByProjectId: Readonly<Record<PrimaryProjectId, () => React.JSX.Element>> = Object.freeze({
  "qgc-planner": QgcPreview,
  "borderpass-ai": BorderPassPreview,
  "ticket-ocr": OcrPreview,
});

export function ProjectEvidence({ eyebrow, heading, items, pendingLabel }: ProjectEvidenceProps): React.JSX.Element {
  return (
    <section id="projects" className="project-evidence" data-motion-section="projects">
      <p className="project-evidence__eyebrow">{eyebrow}</p>
      <h2 className="project-evidence__heading" data-motion-reveal>{heading}</h2>
      {items.map((project) => {
        const Preview = previewByProjectId[project.id];
        return (
          <article key={project.id} className="project-evidence__item" data-project-id={project.id} data-motion-reveal>
            <div className="project-evidence__text">
              <span className="project-evidence__case-label">{project.caseLabel}</span>
              <h4 className="project-evidence__name">{project.name}</h4>
              <p className="project-evidence__summary">{project.summary}</p>
              <ul className="project-evidence__techs">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <ExternalAction destination={project.repository} label={project.name} pendingLabel={pendingLabel} />
            </div>
            <div className="project-evidence__preview">
              <Preview />
            </div>
          </article>
        );
      })}
    </section>
  );
}
