import React, { useState, useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import {
  Search,
  MessageSquare,
  X,
  Bot,
  ImageIcon,
  VideoIcon,
  Download,
  FileText,
  Eye,
  File,
  Filter,
} from "lucide-react";
import { useLoading } from "../context/LoadingContext";
import { getReviewer, getFileUrl } from "../lib/reviewer";
import ViewLesson from "../components/home/ViewLesson";
import { useParams, useNavigate, Link } from "react-router-dom";
// Helper to render the right icon based on file type

const renderSanitizedReviewerContent = (sanitizedHtml) => {
  const cleanHtml = DOMPurify.sanitize(sanitizedHtml || "", {
    USE_PROFILES: { html: true },
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, "text/html");
  const firstHeading = doc.querySelector("h1");

  return {
    sanitizedContent: cleanHtml,
    firstH1Title: firstHeading?.textContent?.trim() || "",
    plainText: doc.body.textContent?.trim() || "",
  };
};

const getFirstH1Title = (html) => {
  const { firstH1Title, plainText } = renderSanitizedReviewerContent(
    html || "",
  );
  return firstH1Title || plainText || "";
};

export default function ReviewerPlatform() {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [lessonData, setLessonData] = useState([]);

  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [previewParam, setPreviewParam] = useState(null);

  const { setLoading } = useLoading();
  const { id } = useParams();
  const navigate = useNavigate();

  const [fileUrl, setFileUrl] = useState(null);

  const previewContentData = useMemo(
    () => renderSanitizedReviewerContent(previewParam?.content || ""),
    [previewParam],
  );

  const handlePreview = async (lessonId) => {
    navigate(`/home/reviewer/${lessonId}`);
  };

  const getFileIcon = (type) => {
    const baseStyle =
      "p-2 rounded-lg border shadow-sm flex items-center justify-center";

    switch (type) {
      case "PDF":
        return (
          <div className={`${baseStyle} bg-red-100 border-red-200`}>
            <FileText className="h-6 w-6 text-red-600" />
          </div>
        );

      case "DOCX":
        return (
          <div className={`${baseStyle} bg-blue-100 border-blue-200`}>
            <File className="h-6 w-6 text-blue-600" />
          </div>
        );

      case "DOC":
        return (
          <div className={`${baseStyle} bg-blue-50 border-blue-200`}>
            <File className="h-6 w-6 text-blue-500" />
          </div>
        );

      case "PNG":
        return (
          <div className={`${baseStyle} bg-emerald-100 border-emerald-200`}>
            <ImageIcon className="h-6 w-6 text-emerald-600" />
          </div>
        );

      case "JPG":
      case "JPEG":
        return (
          <div className={`${baseStyle} bg-indigo-100 border-indigo-200`}>
            <ImageIcon className="h-6 w-6 text-indigo-600" />
          </div>
        );

      case "MP4":
        return (
          <div className={`${baseStyle} bg-yellow-100 border-yellow-200`}>
            <VideoIcon className="h-6 w-6 text-yellow-600" />
          </div>
        );
      default:
        return (
          <div className={`${baseStyle} bg-slate-100 border-slate-200`}>
            <File className="h-6 w-6 text-slate-500" />
          </div>
        );
    }
  };

  const fetchLessonData = async () => {
    setLoading(true);
    try {
      const { data: reviewerData, error: reviewerError } = await getReviewer();

      if (!reviewerData) {
        setLessonData([]);
        return;
      }

      if (reviewerError) {
        console.log("Error fetching reviewer data: ", reviewerError);
      }
      setLessonData(reviewerData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, []);

  useEffect(() => {
    console.log("Fetched lesson data: ", lessonData);
  }, [lessonData]);

  useEffect(() => {
    if (!id) {
      setIsOpenPreview(false);
      setPreviewParam(null);
      setFileUrl(null);
      return;
    }

    const lesson = lessonData.find((l) => String(l.id) === String(id));
    if (lesson) {
      setPreviewParam(lesson);
      setIsOpenPreview(true);
      fetchFileUrlForPreview(lesson.file_path);
    } else {
      setIsOpenPreview(false);
      setPreviewParam(null);
      setFileUrl(null);
    }
  }, [id, lessonData]);

  const fetchFileUrlForPreview = async (filePath) => {
    if (!filePath) {
      setFileUrl(null);
      return;
    }

    const { data, error } = await getFileUrl(filePath);
    if (error) {
      console.error("Error fetching reviewer file URL:", error);
      setFileUrl(null);
      return;
    }

    setFileUrl(data?.publicUrl ?? null);
    console.log("Fetched file URL for preview:", data?.publicUrl ?? null);
  };

  const availableFileTypes = [
    "ALL",
    ...Array.from(
      new Set(
        lessonData
          .map((doc) => String(doc.file_type || "").toUpperCase())
          .filter(Boolean),
      ),
    ),
  ];

  const filteredLessonData = lessonData.filter((doc) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      [previewParam]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    const matchesType =
      selectedFileType === "ALL" ||
      String(doc.file_type).toUpperCase() === selectedFileType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* --- Platform Header --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                InstallerGuro
              </span>
            </Link>

            <div className="flex w-72 md:w-96">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by topic, document name, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Review Materials
          </h1>
          <p className="text-slate-600 mb-8">
            Browse, view, or download the latest study guides and documentation.
          </p>
        </div>

        {/* Materials List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Reviewer</h2>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5 bg-white shadow-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedFileType === "ALL" ? "Filter" : selectedFileType}
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-20">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    File type
                  </p>
                  <div className="space-y-2">
                    {availableFileTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedFileType(type);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                          selectedFileType === type
                            ? "bg-blue-50 text-orange-700"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredLessonData.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No materials match your search or selected filter.
              </div>
            ) : (
              filteredLessonData.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between group"
                >
                  {/* Info Section */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Document Icon */}
                    <div className="shrink-0 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      {getFileIcon(doc.file_type)}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-slate-500 tracking-wider italic">
                          Reviewer Uploaded :{" "}
                          {doc.created_at
                            ? new Date(doc.created_at).toLocaleDateString()
                            : "Unknown date"}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">
                        {getFirstH1Title(doc.content) || doc.content}
                      </h3>

                      {/* Metadata tags */}
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          {doc.file_type}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          {doc.file_size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="flex items-center gap-3 md:w-auto justify-end sm:ml-16 md:ml-0 mt-4 md:mt-0">
                    <button
                      onClick={() => handlePreview(doc.id)}
                      className="flex-1 cursor-pointer md:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2 text-slate-400" /> View
                    </button>
                  </div>
                </div>
              ))
            )}{" "}
          </div>
        </div>
      </main>

      <ViewLesson
        isOpen={isOpenPreview}
        previewData={previewParam}
        fileUrl={fileUrl}
        previewTitle={previewContentData.firstH1Title}
        sanitizedContent={previewContentData.sanitizedContent}
        onClose={() => navigate("/home")}
      ></ViewLesson>

      {/* --- Floating AI Assistant (Study Helper Context) --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Window */}
        {isAiChatOpen && (
          <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 origin-bottom-right flex flex-col h-[400px]">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold text-sm">
                    Reviewer Assistant AI
                  </h3>
                  <p className="text-[10px] text-blue-200">
                    Online • Document Search
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiChatOpen(false)}
                className="text-blue-100 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-tl-none text-sm text-slate-700 shadow-sm">
                    Hi there! 👋 I have read all the uploaded reviewers.
                    <br />
                    <br />
                    Are you looking for a specific topic? You can ask me
                    questions like <em>
                      "What is the standard PPPoE setup?"
                    </em>{" "}
                    and I'll find the answer in the documents!
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask a question about the materials..."
                  className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
            isAiChatOpen
              ? "bg-slate-800 hover:bg-slate-900"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isAiChatOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageSquare className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
