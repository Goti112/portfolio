import type { ExternalDestination } from "@/content/types";

interface ExternalActionProps {
  readonly destination: ExternalDestination;
  readonly label: string;
  readonly pendingLabel: string;
}

function formatDestination(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^mailto:/, "");
}

function ExternalArrowIcon(): React.JSX.Element {
  return (
    <svg className="external-action__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ExternalAction({ destination, label, pendingLabel }: ExternalActionProps): React.JSX.Element {
  if (destination.status === "pending") {
    return (
      <span className="external-action external-action--pending" aria-disabled="true">
        <span className="external-action__content">
          <span className="external-action__label">{label}</span>
          <span className="external-action__pending-label">{pendingLabel}</span>
        </span>
        <span className="external-action__icon-bay" aria-hidden="true">
          <span className="external-action__status-mark" />
        </span>
      </span>
    );
  }

  return (
    <a className="external-action" href={destination.url} rel="noreferrer" target="_blank" aria-label={label}>
      <span className="external-action__content">
        <span className="external-action__label">{label}</span>
        <span className="external-action__destination" aria-hidden="true">{formatDestination(destination.url)}</span>
      </span>
      <span className="external-action__icon-bay" aria-hidden="true">
        <ExternalArrowIcon />
      </span>
    </a>
  );
}
