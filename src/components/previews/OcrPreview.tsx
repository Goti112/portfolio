export function OcrPreview(): React.JSX.Element {
  return (
    <div className="preview-frame preview-frame--ocr" aria-hidden="true">
      <div className="preview-ticket" data-ticket>
        <div className="preview-ticket__header" />
        <div className="preview-scan-line" data-scan-line />
        <div className="preview-output">
          <span className="preview-output-row" data-output-row>DATE</span>
          <span className="preview-output-row" data-output-row>TOTAL</span>
          <span className="preview-output-row" data-output-row>TAX</span>
        </div>
      </div>
    </div>
  );
}
