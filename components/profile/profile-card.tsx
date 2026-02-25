"use client";

import { useState } from "react";
import { Camera, Edit2, Save, X, Check } from "lucide-react";
import Image from "next/image";
import { updateProfile } from "@/lib/actions";

interface ProfileCardProps {
  profile: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  isOwn: boolean;
}

export function ProfileCard({ profile, isOwn }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      setErrorMessage("");
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      setErrorMessage("Display name is required");
      return;
    }

    setErrorMessage("");
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("displayName", displayName.trim());
      formData.append("username", username.trim());
      formData.append("existingAvatarUrl", profile?.avatar_url || "");
      if (avatar) {
        formData.append("avatar", avatar);
      }

      if (isOwn) {
        const result = await updateProfile(formData);
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          setIsEditing(false);
          setSuccessMessage("Profile updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
          // Update preview with new avatar URL if one was uploaded
          if (result.avatarUrl) {
            setAvatarPreview(result.avatarUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessage("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(profile?.display_name || "");
    setUsername(profile?.username || "");
    setAvatar(null);
    setAvatarPreview(profile?.avatar_url || "");
    setIsEditing(false);
    setErrorMessage("");
  };

  return (
    <div className="bg-linear-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 md:mb-8 gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent truncate">
            {isOwn ? "Your Profile" : "Partner's Profile"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isOwn ? "Manage your information" : "View partner details"}
          </p>
        </div>
        {isOwn && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base whitespace-nowrap"
          >
            <Edit2 size={16} className="sm:w-4.5 sm:h-4.5" />
            <span className="hidden xs:inline">Edit</span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-2 sm:gap-3 animate-in text-sm">
          <div className="shrink-0 mt-0.5">⚠️</div>
          <div className="wrap-break-words">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg flex items-start gap-2 sm:gap-3 animate-in text-sm">
          <div className="shrink-0 mt-0.5">
            <Check size={16} className="sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="wrap-break-words">{successMessage}</div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 md:gap-6 md:min-w-max">
          <div className="relative w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 group">
            {avatarPreview ? (
              <>
                <Image
                  src={avatarPreview}
                  alt={displayName || "Profile"}
                  fill
                  className="rounded-full object-cover ring-4 ring-white dark:ring-zinc-700 shadow-xl"
                />
              </>
            ) : (
              <div className="w-full h-full rounded-full bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center ring-4 ring-white dark:ring-zinc-700 shadow-xl">
                <span className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">
                  {displayName?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>

          {isEditing && (
            <label className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-900 dark:text-white rounded-lg cursor-pointer hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-200 border border-blue-200 dark:border-blue-800/50 text-sm sm:text-base">
              <Camera size={16} className="sm:w-4.5 sm:h-4.5" />
              <span className="font-medium">Change Avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="flex-1 space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base"
                placeholder="Enter your display name"
              />
            ) : (
              <p className="text-xl sm:text-2xl text-gray-900 dark:text-white font-bold">
                {displayName || (
                  <span className="text-gray-400 dark:text-gray-500">
                    Not set
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base"
                placeholder="Enter your username (optional)"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                {username ? (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    @{username}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    Not set
                  </span>
                )}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
              >
                <Save size={16} className="sm:w-4.5 sm:h-4.5" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
              >
                <X size={16} className="sm:w-4.5 sm:h-4.5" />
                <span className="hidden xs:inline">Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
