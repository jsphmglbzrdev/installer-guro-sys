import React from "react";
import { X, Save } from "lucide-react";
import RichTextEditor from "../text-editor/RichTextEditor";

const ModifyLesson = ({
  isOpen,
  reviewer,
  content,
  onContentChange,
  onClose,
  onSave,
  saving,
}) => {
  if (!isOpen || !reviewer) return null;

  const hasContent = content
    ? content.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim().length > 0
    : false;

  return (
    <div
      className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs"
      onClick={onClose}
    >	
      <div
        className="relative w-full max-w-4xl max-h-[96vh] mx-4 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Modify Reviewer</h2>
          </div>
          <button
            type="button"
            className="p-2 rounded-full cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="">
              <RichTextEditor initialValue={content} onChange={onContentChange} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
          
            <button
              type="button"
              onClick={onSave}
              disabled={!hasContent || saving}
              className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:bg-slate-300 disabled:text-slate-500"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyLesson;
