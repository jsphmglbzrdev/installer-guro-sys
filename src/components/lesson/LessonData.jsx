import { Trash, Download, Edit } from "lucide-react";
import { saveAs } from "file-saver";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import DOMPurify from "dompurify";

const LessonData = ({ data = [], onModify, onDelete, loading, error }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState(null);

  const openDeleteModal = (reviewer) => {
    setPendingDeletion(reviewer);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!onDelete || !pendingDeletion) return;
    await onDelete(pendingDeletion);
    setIsDeleteModalOpen(false);
    setPendingDeletion(null);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setPendingDeletion(null);
  };

  const isImageUrl = (url) => /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url);
  const isPDFUrl = (url) => /\.pdf$/i.test(url);

  const getPreviewTitle = (html = "") => {
    const sanitized = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });

    const headingMatch = sanitized.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (headingMatch) {
      return headingMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    const text =
      sanitized
        .replace(/<br\s*\/?>(\s*)/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)[0] || "";

    return text;
  };

  const handleDownload = async (item) => {
    if (!item?.fileUrl) return;

    try {
      const res = await fetch(item.fileUrl);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const mimeType = blob.type;
      let extension = "";

      if (isPDFUrl(item.fileUrl) || mimeType === "application/pdf") {
        extension = ".pdf";
      } else if (isImageUrl(item.fileUrl)) {
        const matches = item.fileUrl.match(/\.(jpe?g|png|gif|webp|bmp|svg)$/i);
        extension = matches ? `.${matches[1]}` : ".png";
      } else {
        extension = ".bin";
      }

      const nameBase = item.file_path
        ? item.file_path.replace(/\s+/g, "-").toLowerCase()
        : "download";
      const filename = `${nameBase}${extension}`;

      console.log(filename);

      saveAs(blob, filename);
      toast.success("File downloaded successfully!");
    } catch (downloadError) {
      console.error("Download error", downloadError);
      toast.error("Failed to download file. Please try again.");
      // fallback inline download if library fails
      const link = document.createElement("a");
      link.href = item.fileUrl;
      link.download = item.fileUrl.split("/").pop() || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!data.length) {
    return <p className="text-slate-500">No reviewer uploaded found</p>;
  }

  console.log(data);
  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => {
        const isPdf = item.fileUrl && isPDFUrl(item.fileUrl);
        const isImage = item.fileUrl && isImageUrl(item.fileUrl);
        const displayFileType = item.file_type?.toUpperCase() || "";

        return (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl shadow-md border border-slate-200 p-5 hover:shadow-xl transition-shadow bg-white"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800">
                {getPreviewTitle(item.content) || "Untitled"}
              </h3>
              <p className="text-slate-500">{item.description}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                {item.fileUrl && (
                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className="cursor-pointer inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onModify && onModify(item)}
                  className="cursor-pointer inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
                >
                  <Edit className="w-4 h-4" />
                  Modify
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteModal(item)}
                  className="cursor-pointer inline-flex items-center gap-1 text-slate-500 hover:text-red-900"
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <div className="flex gap-2 mt-2">
                {displayFileType && (
                  <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    {displayFileType}
                  </div>
                )}
                {item.file_size && (
                  <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    {item.file_size}
                  </div>
                )}
              </div>
            </div>

            <div className="w-25 h-30 border border-slate-200 rounded-md overflow-hidden">
              {item.fileUrl ? (
                isPdf ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full items-center justify-center text-blue-600 underline"
                  >
                    VIEW FILE
                  </a>
                ) : isImage ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={item.fileUrl}
                      alt={item.title || "Reviewer image"}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </a>
                ) : (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full items-center justify-center text-blue-600 underline"
                  >
                    VIEW FILE
                  </a>
                )
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400 uppercase">
                  NO FILE
                </div>
              )}
            </div>
          </div>
        );
      })}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        headingText="Delete this lesson?"
        message="Are you sure you want to delete this lesson? This action is irreversible."
        buttonTxt="Confirm"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default LessonData;
