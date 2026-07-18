import Link from "next/link";
import type { Locale, NavigationItem } from "@/content/types";

interface SessionNavigationProps {
  readonly locale: Locale;
  readonly items: readonly NavigationItem[];
  readonly languageLabel: string;
  readonly readOnlyLabel: string;
}

export function SessionNavigation({ locale, items, languageLabel, readOnlyLabel }: SessionNavigationProps): React.JSX.Element {
  const navigationLabel = locale === "es" ? "Navegación principal" : "Main navigation";
  const skipLabel = locale === "es" ? "Saltar al contenido" : "Skip to content";
  const targetLocale = locale === "es" ? "en" : "es";
  const targetHref = locale === "es" ? "/en" : "/";
  const targetLabel = locale === "es" ? "English" : "Español";

  return (
    <>
      <a className="skip-link" href="#profile">{skipLabel}</a>
      <header className="session-nav">
        <span className="session-nav__status" aria-hidden="true">{readOnlyLabel}</span>
        <nav aria-label={navigationLabel}>
          <ul className="session-nav__list">
            {items.map((item) => (
              <li key={item.target}>
                <a href={`#${item.target}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="session-nav__language" href={targetHref} hrefLang={targetLocale} lang={targetLocale}>
          <span className="sr-only">{languageLabel}: </span>{targetLabel}
        </Link>
      </header>
    </>
  );
}
