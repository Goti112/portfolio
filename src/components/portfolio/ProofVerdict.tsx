import { CopyEmail } from "@/components/portfolio/CopyEmail";
import { ExternalAction } from "@/components/portfolio/ExternalAction";
import type { PortfolioContent } from "@/content/types";

interface ProofVerdictProps {
  readonly content: PortfolioContent["contact"];
  readonly pendingLabel: string;
}

export function ProofVerdict({ content, pendingLabel }: ProofVerdictProps): React.JSX.Element {
  const emailAddress = content.email.status === "published" ? content.email.url.replace(/^mailto:/, "") : null;

  return (
    <section id="contact" className="proof-verdict">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <h2>{content.heading}</h2>
      <p className="proof-verdict__lead">{content.lead}</p>
      <div className="proof-verdict__status">
        <p className="proof-verdict__status-bar">
          <span aria-hidden="true">{content.statusLabel}</span>
          <span className="proof-verdict__availability">● {content.availability}</span>
        </p>
        <dl className="proof-verdict__details">
          {content.details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="proof-verdict__actions">
        <div className="proof-verdict__email">
          <ExternalAction destination={content.email} label={content.emailLabel} pendingLabel={pendingLabel} />
          {emailAddress === null ? null : (
            <CopyEmail email={emailAddress} copyLabel={content.copyLabel} copiedLabel={content.copiedLabel} />
          )}
        </div>
        <ExternalAction destination={content.github} label={content.githubLabel} pendingLabel={pendingLabel} />
      </div>
      <p className="proof-verdict__closing" aria-hidden="true">{content.closing}</p>
    </section>
  );
}
