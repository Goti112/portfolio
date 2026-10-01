export function QgcPreview(): React.JSX.Element {
  return (
    <div className="preview-frame preview-frame--qgc" aria-hidden="true">
      <span className="preview-kicker">01 / MISSION PLANNING</span>
      <svg className="preview-route" viewBox="0 0 200 100">
        <path className="preview-route__contour" d="M0 84 Q32 60 72 78 T142 62 T200 40 M0 56 Q40 26 78 48 T152 30 T200 18" />
        <polyline data-route pathLength="1" points="12,75 52,31 103,59 159,24 188,46" />
        <circle cx="12" cy="75" r="3" />
        <circle cx="52" cy="31" r="3" />
        <circle cx="103" cy="59" r="3" />
        <circle cx="159" cy="24" r="3" />
        <circle cx="188" cy="46" r="3" />
      </svg>
      <span className="preview-caption">Map → waypoints → route</span>
    </div>
  );
}
