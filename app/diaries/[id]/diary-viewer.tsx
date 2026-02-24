"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Edit3, Eye } from "lucide-react";
import { MarkdownPreview } from "./markdown-preview";
import { DiaryEditor } from "./diary-editor";

interface DiaryViewerProps {
  diary: {
    id: string;
    title: string;
    diary_date: string;
    photos?: string[];
    content?: string;
  };
}

export function DiaryViewer({ diary }: DiaryViewerProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="relative">
        <div className="fixed top-20 right-6 z-60">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600 shadow-lg shadow-rose-500/10 ring-1 ring-rose-100/60 hover:text-rose-500 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Back to Preview
          </button>
        </div>
        <DiaryEditor diary={diary} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/80 via-white to-rose-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-rose-950/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/diaries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Diaries
          </Link>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-pink-700 transition-all"
          >
            <Edit3 className="h-4 w-4" />
            Edit Chapter
          </button>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {diary.title}
          </h1>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Calendar className="w-4 h-4 text-rose-400" />
            {new Date(diary.diary_date).toLocaleDateString()}
          </div>
        </div>

        {diary.photos && diary.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diary.photos.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="relative aspect-4/3 rounded-3xl overflow-hidden bg-white shadow-sm border border-rose-100/60"
              >
                <Image
                  src={url}
                  alt={`${diary.title} photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-rose-100/60 bg-white/70 p-10 text-center text-gray-400">
            No photos for this diary yet.
          </div>
        )}

        <MarkdownPreview content={diary.content || ""} />
      </div>
    </div>
  );
}
