
import RichTextViewer from "../text-editor/RichTextViewer";

const ViewLesson = ({ isOpen, onClose, children, previewData, fileUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center height-screen">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-xl flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">
            Reviewer Preview
          </h2>
          <button onClick={onClose} className="text-slate-500 cursor-pointer hover:text-black">
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
          {previewData?.content && (
            <div className="mt-6">
              <RichTextViewer html={previewData.content} />
            </div>
          )}
        </div>

        {previewData?.file_path && (
          <div className="px-6 py-4 border-t border-gray-300 flex flex-col gap-2">
            <div>File Attached</div>
            <div>
							<FileRenderer fileUrl={fileUrl} fileType={previewData.file_type} />
						</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLesson;
