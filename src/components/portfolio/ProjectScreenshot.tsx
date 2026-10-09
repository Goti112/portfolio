"use client";

import { useRef } from "react";
import type { ProjectScreenshot as ProjectScreenshotContent } from "@/content/types";

interface ProjectScreenshotProps {
  readonly screenshot: ProjectScreenshotContent;
  readonly sourceLabel: string;
  readonly enlargeLabel: string;
  readonly closeLabel: string;
}

export function ProjectScreenshot({ screenshot, sourceLabel, enlargeLabel, closeLabel }: ProjectScreenshotProps): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = (): void => dialogRef.current?.showModal();
  const close = (): void => dialogRef.current?.close();

  return (
    <>
      <figure className="project-shot" data-project-shot>
        <button type="button" className="project-shot__screen" onClick={open} aria-haspopup="dialog">
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
          <span className="project-shot__zoom">{enlargeLabel}</span>
        </button>
        <figcaption className="project-shot__bar" aria-hidden="true">
          <span>SRC {"//"} {sourceLabel}</span>
          <span>{screenshot.width}×{screenshot.height}</span>
        </figcaption>
      </figure>
      <dialog
        ref={dialogRef}
        className="project-lightbox"
        aria-label={screenshot.alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <button type="button" className="project-lightbox__close" onClick={close}>
          {closeLabel} ✕
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={screenshot.src} width={screenshot.width} height={screenshot.height} alt="" />
      </dialog>
    </>
  );
}
