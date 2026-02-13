"use client";

import { useState } from "react";
import { deletePhoto } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { X, Loader2, Trash2, AlertTriangle } from "lucide-react";

interface DeletePhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photoId: string;
}

export function DeletePhotoDialog({
  isOpen,
  onClose,
  photoId,
}: DeletePhotoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleDelete() {
    try {
      setIsLoading(true);
      setError(null);

      const result = await deletePhoto(photoId);

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
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
        <div className="p-8 pb-4 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Delete Photo
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this photo? This action cannot be
            undone.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-8 py-3 rounded-2xl bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-lg shadow-red-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Delete Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
