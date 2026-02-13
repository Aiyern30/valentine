"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Type,
  Image as ImageIcon,
  Loader2,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { createDiaryEntry, uploadDiaryPhoto } from "@/lib/diary-actions";
import { compressImage, validateImageFile } from "@/lib/image-utils";

export default function NewDiaryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      setIsUploading(true);
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressedFile);

      const result = await uploadDiaryPhoto(formData);
      if (result.success && result.url) {
        setPhotos((prev) => [...prev, result.url!]);
      } else {
        alert(result.error || "Failed to upload photo");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to process image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-bold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Story
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Content Editor */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Title of our Story
                </label>
                <div className="relative group">
                  <Type className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Once upon a time..."
                    className="w-full pl-8 pr-4 py-2 bg-transparent border-b-2 border-gray-100 dark:border-zinc-800 focus:border-rose-500 transition-all outline-hidden text-2xl font-bold font-dancing"
                  />
                </div>
              </div>
            </div>

            {/* Markdown Editor */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden min-h-[600px]">
              <MdEditor
                modelValue={content}
                onChange={setContent}
                placeholder="Write your heart out... (Markdown supported)"
                language="en-US"
                theme="light"
                toolbars={[
                  "bold",
                  "italic",
                  "underline",
                  "strikeThrough",
                  "-",
                  "title",
                  "sub",
                  "sup",
                  "quote",
                  "unorderedList",
                  "orderedList",
                  "task",
                  "-",
                  "link",
                  "image",
                  "table",
                  "code",
                  "-",
                  "revoke",
                  "next",
                  "=",
                  "preview",
                  "catalog",
                ]}
                style={{ height: "600px" }}
              />
            </div>
          </div>

          {/* Right Column: Settings & Photos */}
          <div className="space-y-8">
            {/* Metadata Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Date
                </label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-transparent focus:border-rose-500/20 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-hidden text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Memories Captured
                  </label>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">
                    {photos.length} photos
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border border-gray-100 dark:border-zinc-800"
                    >
                      <img
                        src={url}
                        alt="Memory"
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all group"
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-gray-400 group-hover:text-rose-500" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-rose-500">
                          Add Photo
                        </span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-6 bg-linear-to-br from-indigo-500/5 to-purple-500/5 rounded-[32px] border border-indigo-500/10 space-y-3">
              <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Writer's Tip
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                "Great stories are told from the heart. Add photos to make this
                memory eternal."
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Global CSS for Editor Adjustments */}
      <style jsx global>{`
        .md-editor {
          --md-bk-color: transparent !important;
          border: none !important;
        }
        .md-editor-toolbar-wrapper {
          background-color: transparent !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding: 8px 16px !important;
        }
        .dark .md-editor-toolbar-wrapper {
          border-bottom: 1px solid #27272a !important;
        }
        .md-editor-content {
          padding: 8px !important;
        }
        .md-editor-preview-wrapper {
          font-family: var(--font-geist-sans) !important;
          padding: 40px !important;
        }
        .md-editor-preview-wrapper h1,
        .md-editor-preview-wrapper h2 {
          font-family: var(--font-dancing-script) !important;
          color: #e11d48 !important;
        }
      `}</style>
    </div>
  );
}
