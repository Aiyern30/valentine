"use client";

import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="diary-markdown-preview rounded-[36px] border border-rose-100/70 bg-white/90 p-6 md:p-8 shadow-[0_20px_60px_-40px_rgba(244,63,94,0.35)]">
      <MdPreview editorId="diary-preview" modelValue={content} />
    </div>
  );
}
