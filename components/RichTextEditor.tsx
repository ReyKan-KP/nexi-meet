"use client";

import React from "react";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const Component = ({ ...props }) => <RQ {...props} />;
    Component.displayName = 'QuillWrapper';
    return Component;
  },
  { ssr: false }
);

import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <QuillNoSSRWrapper
      modules={modules}
      theme="snow"
      value={value}
      onChange={onChange}
    />
  );
};

export default RichTextEditor;
