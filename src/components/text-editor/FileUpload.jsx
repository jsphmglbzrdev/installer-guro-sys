// --- Reusable File Upload Component (Simplified Single-Line) ---
import { useState, useRef } from "react";
import { Paperclip, FileText, X } from "lucide-react";

const FileUpload = ({ onFilesChange }) => {

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (onFilesChange) onFilesChange([selectedFile]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (onFilesChange) onFilesChange([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full flex items-center gap-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
      >
        <Paperclip size={16} className="text-orange-500" />
        Attach File
      </button>

      {/* Inline File Display */}
      {file ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-md text-sm overflow-hidden flex-1 max-w-md animate-in fade-in slide-in-from-left-2 duration-200">
          <FileText size={14} className="text-orange-600 shrink-0" />
          <span className="font-medium text-slate-700 truncate">{file.name}</span>
          <span className="text-xs text-slate-500 shrink-0">({formatFileSize(file.size)})</span>
          <button
            onClick={removeFile}
            className="ml-auto p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors shrink-0"
            title="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <span className="text-sm text-slate-400 italic">No file selected</span>
      )}
    </div>
  );
};

export default FileUpload;