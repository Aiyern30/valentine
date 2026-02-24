"use client";

import { useState } from "react";
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
  Info,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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

interface PhotoDetailsProps {
  currentPhoto: Photo;
  isOwner: boolean;
  onImageEdit?: (photo: Photo) => void;
  onEdit?: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
  handleDownload: () => void;
  photos: Photo[];
  currentIndex: number;
  isDrawer?: boolean;
}

function PhotoDetailsComponent({
  currentPhoto,
  photos,
  currentIndex,
  isDrawer = false,
}: PhotoDetailsProps) {
  return (
    <div className={isDrawer ? "px-6 pb-12 pt-0 space-y-6" : "p-6 space-y-6"}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white lg:text-white font-semibold text-lg dark:text-white">
          Photo Details
        </h3>
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
                {new Date(currentPhoto.taken_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
              {new Date(currentPhoto.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Counter */}
      {photos.length > 1 && (
        <div className="pt-4 border-t border-white/10">
          <p className="text-center text-gray-400 text-sm">
            {currentIndex + 1} of {photos.length} photos
          </p>
        </div>
      )}
    </div>
  );
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
      {/* Close Button - Desktop */}
      <button
        onClick={onClose}
        className="hidden lg:block absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
        title="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Info Button - Mobile Only */}
      <button
        onClick={() => setIsDetailsOpen(true)}
        className="lg:hidden absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
        title="Photo Details"
      >
        <Info className="w-5 h-5" />
      </button>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
            title="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
            title="Next"
          >
            <ChevronRight className="w-5 h-5" />
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
            {/* Action Toolbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-2">
              {/* Crop Image */}
              {isOwner && onImageEdit && (
                <button
                  onClick={() => onImageEdit(currentPhoto)}
                  className="p-2.5 rounded-full bg-purple-600/40 hover:bg-purple-600/60 text-purple-200 transition-colors border border-purple-500/50"
                  title="Crop Image"
                >
                  <Wand2 className="w-5 h-5" />
                </button>
              )}

              {/* Edit Title & Date */}
              {isOwner && onEdit && (
                <button
                  onClick={() => onEdit(currentPhoto)}
                  className="p-2.5 rounded-full bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-200 transition-colors border border-cyan-500/50"
                  title="Edit Title & Date"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}

              {/* Download */}
              <button
                onClick={handleDownload}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>

              {/* Delete */}
              {isOwner && onDelete && (
                <button
                  onClick={() => onDelete(currentPhoto)}
                  className="p-2.5 rounded-full bg-red-600/40 hover:bg-red-600/60 text-red-200 transition-colors border border-red-500/50"
                  title="Delete Photo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details Sidebar - Desktop Only */}
        <div className="hidden lg:block w-96 bg-zinc-900/50 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
          <PhotoDetailsComponent
            currentPhoto={currentPhoto}
            isOwner={isOwner}
            onImageEdit={onImageEdit}
            onEdit={onEdit}
            onDelete={onDelete}
            handleDownload={handleDownload}
            photos={photos}
            currentIndex={index}
          />
        </div>
      </div>

      {/* Mobile Details Drawer */}
      <Drawer open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DrawerContent className="bg-zinc-900 border-none text-white">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Photo Details</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[80vh] overflow-y-auto">
            <PhotoDetailsComponent
              currentPhoto={currentPhoto}
              isOwner={isOwner}
              onImageEdit={onImageEdit}
              onEdit={onEdit}
              onDelete={onDelete}
              handleDownload={handleDownload}
              photos={photos}
              currentIndex={index}
              isDrawer
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
