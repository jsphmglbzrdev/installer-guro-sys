import React from "react";
import editorStyles from "./editorStyles";

const RichTextViewer = ({ html = "" }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
      <style>{editorStyles}</style>
      <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default RichTextViewer;
