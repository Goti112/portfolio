import type { PortfolioContent } from "@/content/types";
import { SessionNavigation } from "@/components/portfolio/SessionNavigation";

interface PortfolioPageProps {
  readonly content: PortfolioContent;
}

export function PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element {
  return (
    <div className="portfolio-shell">
      <SessionNavigation
        locale={content.locale}
        items={content.navigation}
        languageLabel={content.system.languageLabel}
        readOnlyLabel={content.system.readOnly}
      />
      <main>
        <section id="profile" className="narrative-section">
          <h1>Miquel Manzano</h1>
          <p>{content.intro.availability}</p>
        </section>
        <section id="capabilities" className="narrative-section" aria-label={content.capabilities.heading} />
        <section id="projects" className="narrative-section" aria-label={content.projects.heading} />
        <section id="education" className="narrative-section" aria-label={content.education.heading} />
        <section id="contact" className="narrative-section" aria-label={content.exit.headingLines.join(" ")} />
      </main>
    </div>
  );
}
