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
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createDiaryEntry } from "@/lib/diary-actions";

export default function NewDiaryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      setIsSaving(true);
      const result = await createDiaryEntry({
        title,
        content,
        diary_date: date,
        photos,
      });

      if (result.success) {
        router.push("/dashboard");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Failed to save diary:", error);
      alert("Failed to save diary entry");
    } finally {
      setIsSaving(false);
    }
  };

  const addPhoto = () => {
    const url = prompt("Enter a photo URL to attach:");
    if (url) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 underline underline-offset-4 decoration-rose-500/30"
            >
              {isPreview ? (
                <>
                  <PenLine className="w-4 h-4 text-rose-500" />
                  Edit Entry
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-rose-500" />
                  Preview
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-bold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save to Diary
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border-2 border-transparent focus:border-rose-500/20 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-hidden text-xl font-bold italic font-dancing"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border-2 border-transparent focus:border-rose-500/20 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Captured Memories
                </label>
                <button
                  onClick={addPhoto}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-50 dark:bg-zinc-950 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-400 hover:text-rose-500 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-rose-500/50 transition-all group font-medium"
                >
                  <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Attach Photo URL
                </button>
              </div>
            </div>

            {/* Attached Photos Preview */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                {photos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl overflow-hidden group shadow-lg"
                  >
                    <img
                      src={url}
                      alt="Attached"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor Area */}
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-xl border border-gray-100 dark:border-zinc-800 min-h-[600px] overflow-hidden flex flex-col focus-within:ring-2 ring-rose-500/20 transition-all">
            <div className="bg-zinc-50 dark:bg-zinc-950/50 px-8 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {isPreview ? "Story Preview" : "Writing Canvas"}
              </span>
              {!isPreview && (
                <div className="flex items-center gap-4 text-[10px] text-gray-400 uppercase tracking-tighter">
                  <span># H1</span>
                  <span>## H2</span>
                  <span>**Bold**</span>
                  <span>*Italic*</span>
                </div>
              )}
            </div>
            <div className="flex-1 relative">
              {isPreview ? (
                <div className="p-12 prose prose-rose dark:prose-invert max-w-none prose-lg prose-p:leading-relaxed prose-headings:font-dancing prose-headings:font-bold prose-headings:text-rose-600">
                  {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400 gap-4">
                      <PenLine className="w-12 h-12 opacity-20" />
                      <p className="italic">Your story starts here...</p>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Once upon a time..."
                  className="w-full h-full min-h-[600px] p-12 bg-transparent text-xl resize-none outline-hidden leading-relaxed font-medium"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
