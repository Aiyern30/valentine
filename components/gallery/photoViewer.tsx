"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Edit2,
  Trash2,
  Clock,
  Wand2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Photo {
  id: string;
  photo_url: string;
  caption: string | null;
  taken_date: string | null;
  created_at: string;
  uploaded_by: string;
  uploader?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface PhotoViewerProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
  onImageEdit?: (photo: Photo) => void;
  currentUserId: string;
}

export function PhotoViewer({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onImageEdit,
  currentUserId,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    if (isOpen) {
      setIndex(currentIndex);
    }
  }, [currentIndex, isOpen]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[index];
  const isOwner = currentPhoto.uploaded_by === currentUserId;

  const goToPrevious = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentPhoto.photo_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `photo-${currentPhoto.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="h-full flex flex-col lg:flex-row">
        {/* Image Area */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
            <Image
              src={currentPhoto.photo_url}
              alt={currentPhoto.caption || "Photo"}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="w-full lg:w-96 bg-zinc-900/50 backdrop-blur-xl border-t lg:border-l lg:border-t-0 border-white/10 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                Photo Details
              </h3>
              <div className="flex items-center gap-2">
                {/* Image Edit Button */}
                {isOwner && onImageEdit && (
                  <button
                    onClick={() => onImageEdit(currentPhoto)}
                    className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"
                    title="Edit Image"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>

                {isOwner && onEdit && (
                  <button
                    onClick={() => onEdit(currentPhoto)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                    title="Edit Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}

                {isOwner && onDelete && (
                  <button
                    onClick={() => onDelete(currentPhoto)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Caption */}
            {currentPhoto.caption && (
              <div className="space-y-2">
                <p className="text-white text-base leading-relaxed">
                  {currentPhoto.caption}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {/* Uploader */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {currentPhoto.uploader?.display_name?.[0] || "?"}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {currentPhoto.uploader?.display_name || "Unknown"}
                  </p>
                  <p className="text-gray-400 text-xs">Uploaded by</p>
                </div>
              </div>

              {/* Date Taken */}
              {currentPhoto.taken_date && (
                <div className="flex items-start gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 mt-0.5 text-rose-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {new Date(currentPhoto.taken_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-xs text-gray-400">Date taken</p>
                  </div>
                </div>
              )}

              {/* Upload Time */}
              <div className="flex items-start gap-3 text-gray-300">
                <Clock className="w-5 h-5 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {formatDistanceToNow(new Date(currentPhoto.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(currentPhoto.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Counter */}
            {photos.length > 1 && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-center text-gray-400 text-sm">
                  {index + 1} of {photos.length} photos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
