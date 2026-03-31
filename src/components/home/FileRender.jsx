


import { saveAs } from "file-saver";

const FileRenderer = ({ fileUrl, fileType, filePath }) => {
  const getFileName = () => {
    const fileName = filePath?.split("/").pop() || fileUrl?.split("/").pop();
    return fileName || "attachment";
  };

  const isImage = () =>
    (fileType?.toLowerCase().startsWith("image/") ?? false) ||
    /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(fileUrl || "");
  const isPDF = () =>
    fileType?.toLowerCase() === "application/pdf" ||
    fileType?.toLowerCase() === "pdf" ||
    /\.pdf(\?.*)?$/i.test(fileUrl || "");

  const openFile = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const fallbackDownload = () => {
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = getFileName();
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadFile = async () => {
    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      saveAs(blob, getFileName());
    } catch (error) {
      console.error("Download failed", error);
      fallbackDownload();
    }
  };

  if (!fileUrl) {
    return <div className="text-slate-500">Unable to load file preview.</div>;
  }

  const renderPreview = () => {
    if (isImage()) {
      return (
        <div className="w-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={fileUrl}
            alt={filePath || "Attached file"}
            className="w-32 h-auto object-contain"
          />
        </div>
      );
    }

    if (isPDF()) {
      return (
        <div className="w-32 max-w-2xl rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <iframe
            src={fileUrl}
            title={getFileName()}
            className="w-32"
            style={{ border: "none" }}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-medium text-slate-700">{getFileName()}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {renderPreview()}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openFile}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-blue-700 bg-white hover:bg-slate-100"
        >
          View file
        </button>
        <button
          type="button"
          onClick={downloadFile}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100"
        >
          Download file
        </button>
      </div>
    </div>
  );
};

export default FileRenderer;