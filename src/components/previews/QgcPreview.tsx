export function QgcPreview(): React.JSX.Element {
  return (
    <div className="preview-frame preview-frame--qgc" aria-hidden="true">
      <div className="preview-grid" />
      <svg className="preview-route" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" data-route>
        <polyline
          points="10,80 50,20 100,60 170,30 190,70"
          fill="none"
          stroke="var(--color-alert)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <circle cx="10" cy="80" r="3" fill="var(--color-bone)" data-waypoint />
        <circle cx="50" cy="20" r="3" fill="var(--color-bone)" data-waypoint />
        <circle cx="100" cy="60" r="3" fill="var(--color-bone)" data-waypoint />
        <circle cx="170" cy="30" r="3" fill="var(--color-bone)" data-waypoint />
      </svg>
      <span className="preview-badge">MAVLINK / CONNECTED</span>
    </div>
  );
}
