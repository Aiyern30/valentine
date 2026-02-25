/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Loader2,
  Trash2,
  Plus,
  ArrowUpRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import {
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  uploadDiaryPhoto,
} from "@/lib/diary-actions";
import { compressImage, validateImageFile } from "@/lib/image-utils";
import Image from "next/image";

interface DiaryEditorProps {
  diary?: any; // If provided, we are in Edit mode
}

export function DiaryEditor({ diary }: DiaryEditorProps) {
  const router = useRouter();
  const isEdit = !!diary;

  const [title, setTitle] = useState(diary?.title || "");
  const [content, setContent] = useState(diary?.content || "");
  const [date, setDate] = useState(
    diary?.diary_date || new Date().toISOString().split("T")[0],
  );
  const [photos, setPhotos] = useState<string[]>(diary?.photos || []);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!title || !content) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title,
        content,
        diary_date: date,
        photos,
      };

      const result = isEdit
        ? await updateDiaryEntry(diary.id, payload)
        : await createDiaryEntry(payload);

      if (result.success) {
        if (!isEdit) router.push("/diaries");
        else router.refresh();
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this memory?")) return;

    try {
      setIsDeleting(true);
      const result = await deleteDiaryEntry(diary.id);
      if (result.success) {
        router.push("/diaries");
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to delete diary entry");
    } finally {
      setIsDeleting(false);
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
    <div
      className={`min-h-screen bg-linear-to-br from-rose-50/80 via-white to-rose-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-rose-950/20 pb-20 transition-all duration-500 ${isFullscreen ? "fixed inset-0 z-100 pb-0 overflow-y-auto" : ""}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/diaries")}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <span className="text-sm font-bold text-gray-300 uppercase tracking-widest hidden sm:block">
              {isEdit ? "Refining our Story" : "A New Chapter"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors hidden sm:flex"
              title={isFullscreen ? "Minimize" : "Focus Mode"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            )}

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
              {isEdit ? "Update Chapter" : "Save Story"}
            </button>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto px-4 transition-all duration-700 ${isFullscreen ? "max-w-none py-4" : "max-w-7xl py-12"}`}
      >
        <div
          className={`grid grid-cols-1 ${isFullscreen ? "lg:grid-cols-1" : "lg:grid-cols-4"} gap-12 items-start`}
        >
          {/* Main Content Area */}
          <div
            className={`${isFullscreen ? "lg:col-span-1" : "lg:col-span-3"} space-y-12`}
          >
            {/* Title & Metadata */}
            <div className="space-y-8 px-4">
              <div className="relative group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title of our story..."
                  className="w-full bg-transparent border-none focus:ring-0 outline-hidden text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 placeholder:text-gray-200 dark:placeholder:text-zinc-800 italic font-dancing transition-all duration-500"
                />
                <div className="h-px w-24 bg-rose-500/30 group-focus-within:w-full transition-all duration-1000 mt-4" />
              </div>

              <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-gray-400">
                <div className="flex items-center gap-3 group custom-datepicker-wrapper">
                  <CalendarIcon className="w-4 h-4 text-rose-500/40 group-hover:text-rose-500 transition-colors" />
                  <DatePicker
                    selected={date ? new Date(date) : null}
                    onChange={(selectedDate: Date | null) => {
                      if (selectedDate) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(2, "0");
                        setDate(`${year}-${month}-${day}`);
                      } else {
                        setDate("");
                      }
                    }}
                    dateFormat="MM/dd/yyyy"
                    className="bg-transparent border-none p-0 focus:ring-0 outline-hidden text-gray-600 dark:text-zinc-400 font-bold uppercase tracking-widest cursor-pointer"
                    calendarClassName="custom-calendar"
                    showPopperArrow={false}
                    popperPlacement="bottom-start"
                    placeholderText="Select a date"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold uppercase tracking-widest">
                  {wordCount} words
                </div>
                <div className="px-4 py-1.5 rounded-full bg-zinc-50 text-zinc-600 text-[11px] font-bold uppercase tracking-widest">
                  ~{readingTime} min read
                </div>
                <div className="px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-[11px] font-bold uppercase tracking-widest">
                  {photos.length} photos
                </div>
              </div>
            </div>

            {/* Markdown Editor - Notion-like Configuration */}
            <div className="bg-white/90 dark:bg-zinc-950 rounded-3xl p-3 border border-gray-100 dark:border-zinc-900/50 shadow-xs focus-within:shadow-2xl transition-all duration-500 min-h-175">
              <MdEditor
                modelValue={content}
                onChange={setContent}
                placeholder="Write your heart out here... (You can use Markdown ✨)"
                language="en-US"
                theme="light"
                preview={true} // Notion-like: show preview next to it or combined
                htmlPreview={false}
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
                  "-",
                  "link",
                  "image",
                  "table",
                  "code",
                  "-",
                  "revoke",
                  "next",
                  "save",
                  "=",
                  "preview",
                  "catalog",
                ]}
                style={{ height: "700px" }}
                className="notion-editor"
              />
            </div>
          </div>

          {!isFullscreen && (
            /* Sidebar: Photos & Stats */
            <div className="space-y-10 lg:sticky lg:top-24">
              {/* Photos Panel */}
              <div className="bg-white/80 dark:bg-zinc-900/70 rounded-[40px] p-8 border border-rose-100/60 dark:border-zinc-800/60 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.25)] space-y-6">
                <div className="flex items-start justify-between px-1">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em]">
                      Memories Captured
                    </p>
                    <p className="text-xs text-gray-400">
                      Keep tiny moments with your words
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-3xl overflow-hidden group shadow-lg border border-white/60 dark:border-zinc-800/80 ring-1 ring-rose-100/40"
                    >
                      <Image
                        src={url}
                        alt="Memory"
                        fill
                        className="object-cover transition-transform group-hover:scale-110 duration-700"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          onClick={() => removePhoto(idx)}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="aspect-4/5 sm:aspect-square rounded-2xl border-2 border-dashed border-rose-200/80 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-white to-rose-50/60 dark:from-zinc-900 dark:to-zinc-900 hover:border-rose-400/70 hover:shadow-md transition-all group"
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-all shadow-sm ring-1 ring-rose-100">
                          <Plus className="w-5 h-5 text-rose-300 group-hover:text-rose-500" />
                        </div>
                        <span className="text-[9px] font-bold text-rose-300 group-hover:text-rose-500 uppercase tracking-widest">
                          Add Memory
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
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-800/30">
                  {photos.length} photos
                </span>
              </div>

              {/* Info Card */}
              <div className="p-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-[40px] text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 opacity-80 uppercase tracking-widest text-[9px] font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    Digital Keepsake
                  </div>
                  <p className="text-sm font-medium leading-relaxed italic opacity-90">
                    "The letters and photos you save here are a reflection of
                    your journey. Write with love."
                  </p>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
