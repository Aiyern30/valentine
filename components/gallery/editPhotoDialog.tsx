"use client";

import { useState } from "react";
import { updatePhoto } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { X, Loader2, Save, Calendar, FileText } from "lucide-react";
import Image from "next/image";

interface EditPhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photo: {
    id: string;
    photo_url: string;
    caption: string | null;
    taken_date: string | null;
  };
}

export function EditPhotoDialog({
  isOpen,
  onClose,
  photo,
}: EditPhotoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      formData.append("photoId", photo.id);

      const result = await updatePhoto(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Success - close dialog and refresh
        onClose();
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
        <div className="p-8 pb-4 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 italic font-dancing">
            Edit Photo
          </h2>
          <button
            onClick={onClose}
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

          {/* Photo Preview */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <Image
              src={photo.photo_url}
              alt={photo.caption || "Photo"}
              fill
              className="object-contain"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Caption
            </label>
            <textarea
              name="caption"
              rows={3}
              defaultValue={photo.caption || ""}
              placeholder="Add a caption to this memory..."
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Date Taken */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              Date Taken
            </label>
            <input
              name="takenDate"
              type="date"
              defaultValue={
                photo.taken_date || new Date().toISOString().split("T")[0]
              }
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
