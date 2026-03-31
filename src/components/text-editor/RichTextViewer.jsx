import React from "react";
import DOMPurify from "dompurify";
import editorStyles from "./editorStyles";

const RichTextViewer = ({ html = "" }) => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  return (
    <div className="w-full">
      <style>{editorStyles}</style>
      <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
};

export default RichTextViewer;
