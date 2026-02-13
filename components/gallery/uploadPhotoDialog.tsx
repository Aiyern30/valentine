"use client";

import { useState, useRef } from "react";
import { uploadPhoto } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  Calendar,
  FileText,
} from "lucide-react";
import {
  compressImage,
  formatFileSize,
  validateImageFile,
} from "@/lib/image-utils";
import Image from "next/image";

interface UploadPhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadPhotoDialog({ isOpen, onClose }: UploadPhotoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setError(null);
    setOriginalSize(file.size);
    setIsCompressing(true);

    try {
      // Compress image
      const compressedFile = await compressImage(file);
      setCompressedSize(compressedFile.size);
      setSelectedFile(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedFile) {
      setError("Please select a photo");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Append the compressed file
      formData.set("file", selectedFile);

      const result = await uploadPhoto(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Success - close dialog and refresh
        onClose();
        router.refresh();
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        setOriginalSize(0);
        setCompressedSize(0);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      setOriginalSize(0);
      setCompressedSize(0);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
        <div className="p-8 pb-4 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 italic font-dancing">
            Upload Memory
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Photo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                ${
                  previewUrl
                    ? "border-rose-500 bg-rose-50/50 dark:bg-rose-900/10"
                    : "border-gray-200 dark:border-zinc-700 hover:border-rose-300 dark:hover:border-rose-700 bg-gray-50/50 dark:bg-zinc-800/50"
                }
                ${isCompressing ? "opacity-50 cursor-wait" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading || isCompressing}
              />

              {previewUrl ? (
                <div className="relative aspect-video w-full">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium">
                    {formatFileSize(originalSize)} →{" "}
                    {formatFileSize(compressedSize)}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center">
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-12 h-12 text-rose-500 mb-4 animate-spin" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Compressing image...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-rose-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Click to upload photo
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB (will be compressed)
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Caption (Optional)
            </label>
            <textarea
              name="caption"
              rows={3}
              placeholder="Add a caption to this memory..."
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Date Taken */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              Date Taken (Optional)
            </label>
            <input
              name="takenDate"
              type="date"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedFile || isCompressing}
              className="px-8 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
