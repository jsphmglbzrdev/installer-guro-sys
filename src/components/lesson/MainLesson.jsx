import { useEffect, useState } from "react";
import {
  insertReviewer,
  uploadFile,
  getReviewer,
  getFileUrl,
  deleteReviewer,
  deleteFile,
} from "../../lib/reviewer";
import { Upload, Paperclip, Send, X } from "lucide-react";
import LessonData from "./LessonData";
import { useLoading } from "../../context/LoadingContext";
import { toast } from "react-toastify";

const MainLesson = () => {
  const { loading, setLoading } = useLoading();
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const { data: reviewerData, error } = await getReviewer();
      if (error) {
        console.error("Failed to fetch reviewers:", error);
        setLessons([]);
        return;
      }

      const enrichedData = await Promise.all(
        reviewerData.map(async (item) => {
          if (!item.file_path) {
            return { ...item, fileUrl: null };
          }

          const { data: urlData, error: urlError } = await getFileUrl(
            item.file_path,
          );
          if (urlError) {
            console.error("Supabase file URL error:", urlError);
            return { ...item, fileUrl: null };
          }

          return { ...item, fileUrl: urlData?.publicUrl ?? null };
        }),
      );

      setLessons(enrichedData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    setLoading(true);

    const file = selectedFile;
    const filePath = file ? `${Date.now()}-${file.name}` : null;

    if (title.trim() === "" || description.trim() === "") {
      toast.error(
        "Please provide both title and description for the material.",
      );
      setLoading(false);
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("File size exceeds 3MB limit. Please choose a smaller file.");
      setLoading(false);
      return;
    }

    try {
      let savedFilePath = null;
      if (file && filePath) {
        const { data: uploadData, error: uploadError } = await uploadFile(
          filePath,
          file,
        );
        if (uploadError) {
          console.error("File upload error:", uploadError);
          toast.error("Material saved but file upload failed");
        } else {
          console.log("File uploaded successfully:", uploadData);
          savedFilePath = filePath;
        }
      }

			const formattedFileType = formatFileType(file?.type);

      const { error: uploadReviewerError } = await insertReviewer(
        title,
        description,
        savedFilePath,
        formatFileSize(file?.size || 0),
        formattedFileType.toUpperCase() || "unknown",
      );

      if (uploadReviewerError) {
        console.error("Error adding material:", uploadReviewerError);
        toast.error("Failed to save material information");
      } else {
        toast.success("Material published successfully!");
      }

      setTitle("");
      setDescription("");
      setFileName("");
      setSelectedFile(null);

      await loadLessons();
    } finally {
      setLoading(false);
    }
  };

  // File size conversion
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";

    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  // File type conversion
  const formatFileType = (mimeType) => {
    if (!mimeType) return "";

    const map = {
      "application/pdf": "pdf",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "text/plain": "txt",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "xlsx",
      "application/zip": "zip",
    };
    return map[mimeType] || mimeType.split("/")[1] || "";
  };

  const handleDelete = async (lesson) => {
    if (!lesson?.id) return;

    setLoading(true);
    try {
      const { error: deleteError } = await deleteReviewer(lesson.id);
      if (deleteError) {
        console.error("Failed to delete material:", deleteError);
        toast.error("Failed to delete material");
        return;
      }

      if (lesson.file_path) {
        const { error: deleteFileError } = await deleteFile(lesson.file_path);
        if (deleteFileError) {
          console.error("Failed to delete file from storage:", deleteFileError);
          toast.warning("Material deleted but failed to remove file");
        } else {
          toast.success("Material deleted successfully!");
        }
      } else {
        toast.success("Material deleted successfully!");
      }

      await loadLessons();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              Publish Review Material
            </h2>
          </div>

          <form onSubmit={handleAddMaterial} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g., Installation Guide v3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description / Instructions
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                placeholder="Write detailed review notes here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Or Upload a File (Mock)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    setFileName(file?.name || "");
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center justify-center px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full"
                >
                  <Paperclip className="w-4 h-4 mr-2 text-slate-400" />
                  {fileName ? fileName : "Choose a file..."}
                </label>
                {fileName && (
                  <button
                    type="button"
                    onClick={() => {
                      setFileName("");
                      setSelectedFile(null);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Publish to Installers</span>
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Recently Published Lessons
          </h3>
          <div className="space-y-3">
            <LessonData
              data={lessons}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLesson;
