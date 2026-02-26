/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { completeProfile, uploadAvatar } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Loader2, User, AtSign, Sparkles, Camera, X } from "lucide-react";
import Image from "next/image";
import { compressImage, validateImageFile } from "@/lib/image-utils";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      let avatarUrl: string | null = null;

      // Upload avatar if selected
      if (selectedImage) {
        // Compress image before upload
        const compressedImage = await compressImage(
          selectedImage,
          400,
          400,
          0.8,
        );

        const avatarFormData = new FormData();
        avatarFormData.append("userId", userId);
        avatarFormData.append("avatar", compressedImage);

        const uploadResult = await uploadAvatar(avatarFormData);
        if (uploadResult.error) {
          setError(uploadResult.error);
          return;
        }
        avatarUrl = uploadResult.avatarUrl || null;
      }

      // Add avatar URL to form data
      if (avatarUrl) {
        formData.append("avatarUrl", avatarUrl);
      }

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
      <div className="relative w-full max-w-lg h-[90vh] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100 dark:border-zinc-800 flex flex-col">
        {/* Header with linear */}
        <div className="bg-linear-to-r from-rose-500 to-pink-500 p-8 text-white relative overflow-hidden shrink-0">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to SweetDays! 💕</h2>
            <p className="text-rose-100">
              Let's set up your profile to get started
            </p>
          </div>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 min-h-0">
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

          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-400" />
              Profile Picture (Optional)
            </label>

            <div className="flex flex-col items-center space-y-4">
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* File Input */}
              <div className="flex flex-col items-center space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {selectedImage ? "Change Photo" : "Choose Photo"}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Max 5MB • JPG, PNG, GIF
                </p>
              </div>
            </div>
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
