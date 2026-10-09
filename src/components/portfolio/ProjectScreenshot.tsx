import type { ProjectScreenshot as ProjectScreenshotContent } from "@/content/types";

interface ProjectScreenshotProps {
  readonly screenshot: ProjectScreenshotContent;
  readonly sourceLabel: string;
}

export function ProjectScreenshot({ screenshot, sourceLabel }: ProjectScreenshotProps): React.JSX.Element {
  return (
    <figure className="project-shot" data-project-shot>
      <div className="project-shot__screen">
        {/* Static export: screenshots are pre-optimised WebP files, so next/image adds nothing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshot.src}
          width={screenshot.width}
          height={screenshot.height}
          alt={screenshot.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="project-shot__bar" aria-hidden="true">
        <span>SRC {"//"} {sourceLabel}</span>
        <span>{screenshot.width}×{screenshot.height}</span>
      </figcaption>
    </figure>
  );
}
