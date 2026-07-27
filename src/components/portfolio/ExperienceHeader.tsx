import type { PortfolioContent } from "@/content/types";

interface ExperienceHeaderProps {
  readonly content: PortfolioContent;
}

export function ExperienceHeader({ content }: ExperienceHeaderProps): React.JSX.Element {
  const navigationLabel = content.locale === "es" ? "Navegación principal" : "Main navigation";
  const skipLabel = content.locale === "es" ? "Saltar al contenido" : "Skip to content";
  const targetLocale = content.locale === "es" ? "en" : "es";
  const targetHref = content.locale === "es" ? "/" : "/es";
  const targetLabel = content.locale === "es" ? "English" : "Español";

  return (
    <>
      <a className="skip-link" href="#main-content">{skipLabel}</a>
      <header className="experience-header">
        <nav aria-label={navigationLabel}>
          <ul className="experience-header__navigation">
            {content.navigation.map((item) => (
              <li key={item.target}>
                <a href={`#${item.target}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className="experience-header__language"
          href={targetHref}
          hrefLang={targetLocale}
          lang={targetLocale}
        >
          <span className="sr-only">{content.system.languageLabel}: </span>
          {targetLabel}
        </a>
        <div className="experience-progress" aria-label={content.system.progressLabel}>
          <span data-progress-value>01</span>
          <span aria-hidden="true"> / 06</span>
        </div>
      </header>
    </>
  );
}
