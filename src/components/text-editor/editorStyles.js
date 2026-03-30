const editorStyles = `
  .ProseMirror {
    outline: none !important;
    min-height: 300px;
    padding: 1.5rem;
  }
  .ProseMirror > * + * {
    margin-top: 0.75em;
  }
  .ProseMirror h1 {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: #0f172a;
  }
  .ProseMirror h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: #1e293b;
  }
  .ProseMirror h1:first-child,
  .ProseMirror h2:first-child {
    margin-top: 0;
  }
  .ProseMirror ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
  .ProseMirror ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
  }
  .ProseMirror li {
    margin-bottom: 0.25rem;
  }
  .ProseMirror p {
    line-height: 1.6;
    color: #334155;
  }
  .ProseMirror blockquote {
    border-left: 4px solid #cbd5e1;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    color: #64748b;
    background-color: #f8fafc;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0 0.25rem 0.25rem 0;
  }
  .ProseMirror code {
    background-color: #f1f5f9;
    color: #db2777;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  .ProseMirror pre {
    background-color: #1e293b;
    color: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
`;

export default editorStyles;
