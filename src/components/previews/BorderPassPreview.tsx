export function BorderPassPreview(): React.JSX.Element {
  return (
    <div className="preview-frame preview-frame--borderpass" aria-hidden="true">
      <div className="preview-document" data-document>
        <div className="preview-document__spine" />
        <div className="preview-document__content">
          <div className="preview-decision-steps">
            <span className="preview-decision-step" data-decision-step>IMPORT</span>
            <span className="preview-decision-step" data-decision-step>CBAM</span>
            <span className="preview-decision-step" data-decision-step>REVIEW</span>
          </div>
          <span className="preview-status">ANALYSIS READY</span>
        </div>
      </div>
    </div>
  );
}
