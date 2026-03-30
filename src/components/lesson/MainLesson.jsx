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
import FileUpload from "../text-editor/FileUpload";
import RichTextEditor from "../text-editor/RichTextEditor";

const MainLesson = () => {
  const { loading, setLoading } = useLoading();
  const [lessons, setLessons] = useState([]);
 
  const [editorContent, setEditorContent] = useState("");

  const [attachments, setAttachments] = useState([]);

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

	const handleAddReviewer = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data, error } = await insertReviewer(
				editorContent,
				null,
				formatFileSize(attachments[0]?.size),
				formatFileType(attachments[0]?.type)
			);

			if (error) {
				console.error("Failed to insert reviewer:", error);
				toast.error("Unable to save review content.");
				return;
			}

			console.log("Saved reviewer content:", data);
			toast.success("Review content saved to Supabase.");
			setEditorContent("");
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

          <div className="flex flex-col gap-5">
            <RichTextEditor
              initialValue={editorContent}
              onChange={setEditorContent}
            />
            <FileUpload onFilesChange={setAttachments} />
		            <button
              type="button"
              className="w-full cursor-pointer hover:bg-orange-400 bg-orange-500 text-white py-2 font-sans rounded-md"
              onClick={handleAddReviewer}
            >
              Publish
            </button>
          </div>
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
