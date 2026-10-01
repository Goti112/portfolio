export function OcrPreview(): React.JSX.Element {
  return (
    <div className="preview-frame preview-frame--ocr" aria-hidden="true">
      <span className="preview-kicker">03 / DATA EXTRACTION</span>
      <div className="preview-ocr-flow">
        <div className="preview-ticket" data-ticket>
          <span className="preview-ticket__mark">RECEIPT</span>
          <i /><i /><i /><i />
        </div>
        <span className="preview-ocr-flow__arrow">→</span>
        <div className="preview-output">
          <span className="preview-output-row" data-output-row><b>Date</b><i /></span>
          <span className="preview-output-row" data-output-row><b>Total</b><i /></span>
          <span className="preview-output-row" data-output-row><b>Tax</b><i /></span>
        </div>
      </div>
      <span className="preview-caption">Receipt → structured fields</span>
    </div>
  );
}
