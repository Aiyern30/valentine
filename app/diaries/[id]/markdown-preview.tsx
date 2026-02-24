"use client";

import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="rounded-3xl border border-rose-100/60 bg-white/80 p-6 md:p-8 shadow-sm">
      <MdPreview
        editorId="diary-preview"
        modelValue={content}
        className="prose prose-rose max-w-none"
      />
    </div>
  );
}
