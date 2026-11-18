import { CopyEmail } from "@/components/portfolio/CopyEmail";
import { ExternalAction } from "@/components/portfolio/ExternalAction";
import { Timecode } from "@/components/portfolio/Timecode";
import type { PortfolioContent } from "@/content/types";

interface ProofVerdictProps {
  readonly content: PortfolioContent["contact"];
  readonly pendingLabel: string;
}

const SIGN_OFF_BARS: readonly string[] = ["ink", "sand", "phosphor", "moss", "rose", "accent", "plum"];

export function ProofVerdict({ content, pendingLabel }: ProofVerdictProps): React.JSX.Element {
  const emailAddress = content.email.status === "published" ? content.email.url.replace(/^mailto:/, "") : null;

  return (
    <section id="contact" className="proof-verdict">
      <span className="section-ghost" aria-hidden="true" data-ghost>04</span>
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <div className="proof-verdict__grid">
        <div className="proof-verdict__pitch">
          <h2 data-reveal="wipe">{content.heading}</h2>
          <p className="proof-verdict__lead">{content.lead}</p>
          <div className="proof-verdict__actions">
            <div className="proof-verdict__email">
              <ExternalAction destination={content.email} label={content.emailLabel} pendingLabel={pendingLabel} />
              {emailAddress === null ? null : (
                <CopyEmail email={emailAddress} copyLabel={content.copyLabel} copiedLabel={content.copiedLabel} />
              )}
            </div>
            <ExternalAction destination={content.github} label={content.githubLabel} pendingLabel={pendingLabel} />
          </div>
        </div>
        <div className="proof-verdict__status" data-reveal="rise" data-spotlight>
          <p className="proof-verdict__status-bar">
            <span aria-hidden="true">{content.statusLabel}</span>
            <span className="proof-verdict__availability">
              <span className="proof-verdict__beacon" aria-hidden="true" />
              {content.availability}
            </span>
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
      </div>
      <div className="proof-verdict__sign-off" aria-hidden="true">
        <div className="proof-verdict__bars">
          {SIGN_OFF_BARS.map((tone) => (
            <span key={tone} data-tone={tone} />
          ))}
        </div>
        <p className="proof-verdict__closing">
          <span>{content.closing}</span>
          <span className="proof-verdict__runtime">RUNTIME <Timecode /></span>
        </p>
      </div>
    </section>
  );
}
