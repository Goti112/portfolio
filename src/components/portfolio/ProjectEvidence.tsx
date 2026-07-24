import type { PrimaryProject, PrimaryProjectId } from "@/content/types";
import { ProjectCaseScene } from "@/components/portfolio/ProjectCaseScene";
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
    <section id="projects" className="project-evidence" data-scene="projects" data-project-stage data-motion-section="projects">
      <p className="project-evidence__eyebrow">{eyebrow}</p>
      <h2 className="project-evidence__heading" data-motion-reveal>{heading}</h2>
      <div className="project-evidence__layout">
        <div data-project-copy-track>
          {items.map((project) => (
            <ProjectCaseScene
              key={project.id}
              project={project}
              pendingLabel={pendingLabel}
              preview={previewByProjectId[project.id]}
            />
          ))}
        </div>
        <div aria-hidden="true" data-project-visual-stage>
          {items.map((project) => {
            const Preview = previewByProjectId[project.id];
            return (
              <div key={project.id} data-project-preview={project.id}>
                <Preview />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
