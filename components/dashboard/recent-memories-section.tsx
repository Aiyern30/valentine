"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { PhotoViewerDialog } from "./photo-viewer-dialog";

interface Photo {
  id: string;
  photo_url: string;
  caption?: string;
  taken_date?: string;
  created_at: string;
}

export function RecentMemoriesSection({ photos }: { photos: Photo[] }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const openViewer = (index: number) => {
    setSelectedPhotoIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Memories</h3>
          <button className="text-sm text-rose-500 font-medium hover:underline">
            View Gallery
          </button>
        </div>
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openViewer(index)}
                className="aspect-square rounded-xl bg-gray-100 dark:bg-zinc-900 overflow-hidden relative group cursor-pointer"
              >
                <Image
                  src={photo.photo_url}
                  alt={photo.caption || "Memory"}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="text-white font-medium text-sm backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full">
                    View
                  </span>
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs line-clamp-1">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No photos uploaded yet
            </p>
            <button className="mt-2 text-rose-500 text-sm hover:underline font-medium">
              Upload your first photo
            </button>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <PhotoViewerDialog
          photos={photos}
          initialIndex={selectedPhotoIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
