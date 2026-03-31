import RichTextViewer from "../text-editor/RichTextViewer";
import FileRenderer from "../home/FileRender";

const isImageUrl = (url) => /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url);
const isPDFUrl = (url) => /\.pdf$/i.test(url);

const ViewLesson = ({
  isOpen,
  onClose,
  children,
  previewData,
  fileUrl,
  previewTitle,
  sanitizedContent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center height-screen">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex py-5 px-5 justify-end border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-slate-500 cursor-pointer hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6">
          {children}

          {sanitizedContent && (
            <div className="mt-2">
              <RichTextViewer html={sanitizedContent} />
            </div>
          )}
        </div>

        {previewData?.file_path && (
          <div className="px-6 py-4 border-t border-gray-300 flex flex-col gap-2">
            <div>File Attached</div>
            <div>
              <FileRenderer
                fileUrl={fileUrl}
                fileType={previewData.file_type}
                filePath={previewData.file_path}
                isImageUrl={isImageUrl}
                isPDFUrl={isPDFUrl}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLesson;
