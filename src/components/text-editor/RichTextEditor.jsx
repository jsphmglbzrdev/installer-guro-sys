import React, { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  RemoveFormatting,
  SquareTerminal,
} from "lucide-react";
import editorStyles from "./editorStyles";

const ToolbarButton = ({ onClick, isActive, disabled, icon: Icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    className={`
      p-2 rounded-md transition-colors duration-150 flex items-center justify-center
      ${isActive ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
      ${disabled ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-600" : "cursor-pointer"}
    `}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
  </button>
);

const RichTextEditor = ({ initialValue = "", onChange }) => {
  const editorRef = useRef(null);
  const [activeStates, setActiveStates] = useState({});
  const [wordCount, setWordCount] = useState(0);

  const updateActiveStates = () => {
    if (!editorRef.current) return;

    const formatBlock = document.queryCommandValue("formatBlock");
    const isH1 = formatBlock && formatBlock.toLowerCase() === "h1";
    const isH2 = formatBlock && formatBlock.toLowerCase() === "h2";
    const isBlockquote = formatBlock && formatBlock.toLowerCase() === "blockquote";
    const isPre = formatBlock && formatBlock.toLowerCase() === "pre";

    setActiveStates({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      strike: document.queryCommandState("strikeThrough"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
      h1: isH1,
      h2: isH2,
      blockquote: isBlockquote,
      pre: isPre,
    });

    const text = editorRef.current.innerText || "";
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWordCount(words);
  };

  const handleInput = () => {
    updateActiveStates();
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) editorRef.current.focus();
  };

  const handleFormatBlock = (tag) => {
    execCommand("formatBlock", tag);
  };

  useEffect(() => {
    if (!editorRef.current) return;

    if (editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = initialValue || "<h1><br></h1>";
      updateActiveStates();
    }
  }, [initialValue]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-400">
      <style>{editorStyles}</style>

      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl">
        <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
          <ToolbarButton onClick={() => execCommand("undo")} icon={Undo} title="Undo" />
          <ToolbarButton onClick={() => execCommand("redo")} icon={Redo} title="Redo" />
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-300">
          <ToolbarButton onClick={() => execCommand("bold")} isActive={activeStates.bold} icon={Bold} title="Bold" />
          <ToolbarButton onClick={() => execCommand("italic")} isActive={activeStates.italic} icon={Italic} title="Italic" />
          <ToolbarButton onClick={() => execCommand("strikeThrough")} isActive={activeStates.strike} icon={Strikethrough} title="Strikethrough" />
          <ToolbarButton onClick={() => execCommand("removeFormat")} icon={RemoveFormatting} title="Clear Formatting" />
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-300">
          <ToolbarButton onClick={() => handleFormatBlock("H1")} isActive={activeStates.h1} icon={Heading1} title="Heading 1" />
          <ToolbarButton onClick={() => handleFormatBlock("H2")} isActive={activeStates.h2} icon={Heading2} title="Heading 2" />
          <ToolbarButton onClick={() => execCommand("insertUnorderedList")} isActive={activeStates.ul} icon={List} title="Bullet List" />
          <ToolbarButton onClick={() => execCommand("insertOrderedList")} isActive={activeStates.ol} icon={ListOrdered} title="Ordered List" />
        </div>

        <div className="flex items-center gap-1 pl-2">
          <ToolbarButton onClick={() => handleFormatBlock("BLOCKQUOTE")} isActive={activeStates.blockquote} icon={Quote} title="Blockquote" />
          <ToolbarButton onClick={() => handleFormatBlock("PRE")} isActive={activeStates.pre} icon={SquareTerminal} title="Code Block" />
        </div>
      </div>

      <div className="w-full bg-white">
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleInput}
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          className="ProseMirror min-h-70 max-h-[56vh] overflow-y-auto p-4"
          spellCheck="false"
        />
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-xs text-slate-500 flex justify-between items-center rounded-b-xl">
        <span>{wordCount} words</span>
        <span>InstallerGuro</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
