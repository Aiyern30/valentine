"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Type,
  Image as ImageIcon,
  Loader2,
  Eye,
  PenLine,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function NewDiaryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      setIsSaving(true);
      // In a real app, we would call a server action here
      // For now, we'll just simulate a delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Saving diary:", { title, content, date });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save diary:", error);
      alert("Failed to save diary entry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              {isPreview ? (
                <>
                  <PenLine className="w-4 h-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Entry
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Entry Title
              </label>
              <div className="relative group">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Today was amazing because..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-transparent focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-hidden text-lg font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Date
              </label>
              <div className="relative group">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-transparent focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 min-h-[500px] overflow-hidden">
            {isPreview ? (
              <div className="p-8 prose prose-rose dark:prose-invert max-w-none">
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">
                    Nothing to preview yet...
                  </p>
                )}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your heart out here... (Markdown is supported! Use # for titles, * for bullets, etc.)"
                className="w-full h-full min-h-[500px] p-8 bg-transparent text-lg resize-none outline-hidden leading-relaxed"
              />
            )}
          </div>

          {/* Guidelines */}
          {!isPreview && (
            <div className="flex items-center gap-4 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-xs text-gray-500 dark:text-gray-400">
              <span className="font-bold flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Tip:
              </span>
              <span>
                You can use Markdown to style your text. Try # Heading,
                **Bold**, or *Italic*.
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
