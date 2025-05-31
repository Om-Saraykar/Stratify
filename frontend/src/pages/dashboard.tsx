/* eslint-disable prettier/prettier */
import { useState, useRef, useEffect } from "react";

import DefaultLayout from "@/layouts/default";


export default function NoteEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  return (
    <DefaultLayout>
          <div className="max-w-2xl mx-auto mt-10 p-4 rounded-2xl shadow-lg border bg-white">
              <input
                  className="w-full text-2xl font-semibold outline-none border-none bg-transparent mb-4"
                  placeholder="Untitled"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                  ref={textareaRef}
                  className="w-full text-base outline-none resize-none border-none bg-transparent"
                  placeholder="Write something..."
                  rows={1}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
              />
          </div>
    </DefaultLayout>
  );
}
