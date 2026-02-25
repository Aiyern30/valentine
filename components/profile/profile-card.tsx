"use client";

import { useState } from "react";
import { Camera, Edit2, Save, X } from "lucide-react";
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
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isOwn ? "Your Profile" : "Partner's Profile"}
        </h2>
        {isOwn && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt={displayName || "Profile"}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {displayName?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>

          {isEditing && (
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors">
              <Camera size={16} />
              <span className="text-sm">Change Avatar</span>
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
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your display name"
              />
            ) : (
              <p className="text-lg text-gray-900 dark:text-white font-semibold">
                {displayName || "Not set"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-400">
                {username ? `@${username}` : "Not set"}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
