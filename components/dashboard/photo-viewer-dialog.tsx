"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Photo {
  id: string;
  photo_url: string;
  caption?: string;
  taken_date?: string;
  created_at: string;
}

interface PhotoViewerDialogProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoViewerDialog({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: PhotoViewerDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

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
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Photo counter */}
      <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Main content */}
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
        {/* Image container */}
        <div className="relative w-full max-w-5xl aspect-4/3 mb-6">
          <Image
            src={currentPhoto.photo_url}
            alt={currentPhoto.caption || "Photo"}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Caption and metadata */}
        {(currentPhoto.caption || currentPhoto.taken_date) && (
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            {currentPhoto.caption && (
              <p className="text-lg mb-3">{currentPhoto.caption}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-white/70">
              {currentPhoto.taken_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(currentPhoto.taken_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {hasPrevious && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-5xl mx-auto">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-2 ring-rose-500 scale-110"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.photo_url}
                alt=""
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
