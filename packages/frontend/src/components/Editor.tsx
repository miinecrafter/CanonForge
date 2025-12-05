import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ content, setContent }: any) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    }
  });

  if (!editor) return null;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <EditorContent editor={editor} />
    </div>
  );
}
