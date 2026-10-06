import type { PortfolioContent } from "@/content/types";

interface FormationTraceProps {
  readonly content: PortfolioContent["education"];
}

export function FormationTrace({ content }: FormationTraceProps): React.JSX.Element {
  return (
    <section id="education" className="formation-trace">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <h2 className="formation-trace__heading">{content.heading}</h2>
      <ol className="formation-trace__list">
        {content.items.map((item) => (
          <li
            key={item.abbreviation}
            className={item.endYear === null
              ? "formation-trace__item formation-trace__item--current"
              : "formation-trace__item"}
          >
            <span className="formation-trace__code">{item.abbreviation}</span>
            <time dateTime={String(item.startYear)}>{item.startYear}</time>
            <span aria-hidden="true"> — </span>
            {item.endYear === null ? (
              <span>{content.currentLabel}</span>
            ) : (
              <time dateTime={String(item.endYear)}>{item.endYear}</time>
            )}
            <p className="formation-trace__qualification">{item.qualification}</p>
            <p className="formation-trace__institution">{item.institution}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
