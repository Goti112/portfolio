export function BorderPassPreview(): React.JSX.Element {
  return (
    <div className="preview-frame preview-frame--borderpass" aria-hidden="true">
      <span className="preview-kicker">02 / CBAM WORKFLOW</span>
      <div className="preview-decision-steps">
        <div className="preview-decision-step" data-decision-step><span>01</span><strong>Import</strong></div>
        <div className="preview-decision-step" data-decision-step><span>02</span><strong>CBAM</strong></div>
        <div className="preview-decision-step" data-decision-step><span>03</span><strong>Review</strong></div>
      </div>
      <span className="preview-caption">Information → control → decision</span>
    </div>
  );
}
