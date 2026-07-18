import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createPortfolioMotion(root: HTMLElement): () => void {
  const context = gsap.context(() => {
    const sections = gsap.utils.toArray<HTMLElement>("[data-motion-section]", root);

    for (const section of sections) {
      const revealTargets = section.querySelectorAll<HTMLElement>("[data-motion-reveal]");

      if (revealTargets.length === 0) {
        continue;
      }

      gsap.fromTo(
        revealTargets,
        { yPercent: 12, opacity: 0.35 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "center 48%",
            scrub: 0.6,
          },
        },
      );
    }

    gsap.to("[data-corruption-line]", {
      xPercent: 9,
      skewX: -7,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "45% top",
        scrub: true,
      },
    });

    gsap.fromTo("[data-scan-line]", { yPercent: -110 }, {
      yPercent: 520,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-ticket]",
        start: "top 78%",
        end: "bottom 35%",
        scrub: true,
      },
    });

    gsap.from("[data-output-row]", {
      xPercent: 18,
      opacity: 0,
      stagger: 0.12,
      scrollTrigger: {
        trigger: "[data-ticket]",
        start: "center 70%",
        end: "bottom 35%",
        scrub: true,
      },
    });
  }, root);

  return (): void => {
    context.revert();
  };
}
