/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { completeProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Loader2, User, AtSign, Sparkles } from "lucide-react";

interface ProfileCompletionDialogProps {
  userId: string;
  userEmail: string;
}

export function ProfileCompletionDialog({
  userId,
  userEmail,
}: ProfileCompletionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await completeProfile(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Success - refresh the page to show dashboard
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Dialog - Cannot be closed */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100 dark:border-zinc-800">
        {/* Header with Gradient */}
        <div className="bg-linear-to-r from-rose-500 to-pink-500 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to LoveLink! 💕</h2>
            <p className="text-rose-100">
              Let's set up your profile to get started
            </p>
          </div>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <input type="hidden" name="userId" value={userId} />

          {/* Email Display (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <AtSign className="w-4 h-4 text-gray-400" />
              Email
            </label>
            <div className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400">
              {userEmail}
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Display Name
              <span className="text-rose-500">*</span>
            </label>
            <input
              name="displayName"
              type="text"
              required
              placeholder="e.g. Sarah Johnson"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              This is how your partner will see you
            </p>
          </div>

          {/* Username (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Username (Optional)
            </label>
            <input
              name="username"
              type="text"
              placeholder="e.g. sarah_j"
              pattern="[a-zA-Z0-9_]{3,20}"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              3-20 characters, letters, numbers and underscores only
            </p>
          </div>

          {/* Avatar URL (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Profile Picture URL (Optional)
            </label>
            <input
              name="avatarUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              You can update this later
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Setting up your profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Complete Setup
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
}
