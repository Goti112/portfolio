import type { PortfolioContent } from "@/content/types";

interface EducationLogProps {
  readonly content: PortfolioContent["education"];
}

export function EducationLog({ content }: EducationLogProps): React.JSX.Element {
  return (
    <section id="education" className="education-log" data-motion-section="education">
      <p className="narrative-eyebrow" data-motion-reveal>{content.eyebrow}</p>
      <h2 className="education-log__heading" data-motion-reveal>{content.heading}</h2>
      <ol className="education-log__list">
        {content.items.map((item) => (
          <li key={item.abbreviation} className="education-log__item" data-motion-reveal>
            <time dateTime={String(item.startYear)}>{item.startYear}</time>
            <span aria-hidden="true"> — </span>
            <time dateTime={String(item.endYear)}>{item.endYear}</time>
            <p className="education-log__qualification">{item.qualification}</p>
            <p className="education-log__institution">{item.institution}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
