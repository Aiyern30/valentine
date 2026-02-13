"use client";

import { useState } from "react";
import { setAnniversary } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { X, Loader2, CalendarHeart, Info } from "lucide-react";

interface SetAnniversaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetAnniversaryDialog({
  isOpen,
  onClose,
}: SetAnniversaryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await setAnniversary(formData);

      if (result.error) {
        setError(result.error);
      } else {
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
        {/* Header */}
        <div className="bg-linear-to-r from-rose-500 to-pink-500 p-6 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <CalendarHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Set Your Anniversary</h2>
                <p className="text-rose-100 text-sm">
                  When did your story begin?
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {/* Anniversary Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <CalendarHeart className="w-4 h-4 text-rose-500" />
              Anniversary Date
              <span className="text-rose-500">*</span>
            </label>
            <input
              name="anniversaryDate"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              The day your relationship officially started
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                  About Partners
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  You can invite your partner later to share photos, milestones,
                  and memories together. For now, enjoy tracking your personal
                  moments! 💕
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CalendarHeart className="w-5 h-5" />
                  Set Date
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
