import type { PortfolioContent } from "@/content/types";

interface FormationTraceProps {
  readonly content: PortfolioContent["education"];
}

export function FormationTrace({ content }: FormationTraceProps): React.JSX.Element {
  return (
    <section id="education" className="formation-trace">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <h2 className="formation-trace__heading">{content.heading}</h2>
      <p className="formation-trace__trace-label" aria-hidden="true">{content.traceLabel}</p>
      <ol className="formation-trace__list">
        {content.items.map((item) => (
          <li
            key={item.abbreviation}
            className={item.endYear === null
              ? "formation-trace__item formation-trace__item--current"
              : "formation-trace__item"}
          >
            <span className="formation-trace__node" aria-hidden="true" />
            <p className="formation-trace__period">
              <time dateTime={String(item.startYear)}>{item.startYear}</time>
              <span aria-hidden="true"> — </span>
              {item.endYear === null ? (
                <span className="formation-trace__current">{content.currentLabel}</span>
              ) : (
                <time dateTime={String(item.endYear)}>{item.endYear}</time>
              )}
            </p>
            <p className="formation-trace__code">
              {item.abbreviation} <span className="formation-trace__level">· {item.level}</span>
            </p>
            <p className="formation-trace__qualification">{item.qualification}</p>
            <p className="formation-trace__institution">{item.institution}</p>
            {item.internship === undefined ? null : (
              <div className="formation-trace__internship" data-internship={item.abbreviation}>
                <p className="formation-trace__internship-label">
                  {item.internship.label}
                  <time className="formation-trace__internship-period" dateTime={item.internship.startMonth}>
                    {item.internship.period}
                  </time>
                </p>
                <p className="formation-trace__internship-description">{item.internship.description}</p>
                <ul className="formation-trace__techs">
                  {item.internship.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
