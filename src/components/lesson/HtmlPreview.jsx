import DOMPurify from "dompurify";

function HtmlPreview({ html = "", content = "" }) {
  const rawHtml = html || content || "";
  const sanitizedContent = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

export default HtmlPreview;