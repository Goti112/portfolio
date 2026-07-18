import type { ExternalDestination } from "@/content/types";

interface ExternalActionProps {
  readonly destination: ExternalDestination;
  readonly label: string;
  readonly pendingLabel: string;
}

export function ExternalAction({ destination, label, pendingLabel }: ExternalActionProps): React.JSX.Element {
  if (destination.status === "pending") {
    return (
      <span className="external-action external-action--pending" aria-disabled="true">
        <span>{label}</span>
        <span aria-hidden="true">{pendingLabel}</span>
      </span>
    );
  }

  return (
    <a className="external-action" href={destination.url} rel="noreferrer" target="_blank">
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
