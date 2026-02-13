"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Upload, Image as ImageIcon } from "lucide-react";
import {
  formatDistanceToNow,
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { DeletePhotoDialog } from "./deletePhotoDialog";
import { EditPhotoDialog } from "./editPhotoDialog";
import { PhotoViewer } from "./photoViewer";
import { UploadPhotoDialog } from "./uploadPhotoDialog";
import { DateFilter, type DateFilter as DateFilterType } from "./dateFilter";
import { ImageEditor } from "./imageEditor";
import { useRouter } from "next/navigation";
import { updatePhotoImage } from "@/lib/actions";

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

interface GalleryGridProps {
  photos: Photo[];
  currentUserId: string;
}

export function GalleryGrid({ photos, currentUserId }: GalleryGridProps) {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({ type: "all" });

  const handleImageSave = async (blob: Blob) => {
    if (!selectedPhoto) return;

    const result = await updatePhotoImage(selectedPhoto.id, blob);
    if (result.success) {
      router.refresh();
      setEditorOpen(false);
      setSelectedPhoto(null);
    } else {
      alert(result.error || "Failed to save image");
    }
  };

  // Filter photos by date
  const filteredPhotos = useMemo(() => {
    if (dateFilter.type === "all") return photos;

    return photos.filter((photo) => {
      const photoDate = parseISO(photo.taken_date || photo.created_at);

      switch (dateFilter.type) {
        case "today":
          return isToday(photoDate);
        case "week":
          return isThisWeek(photoDate);
        case "month":
          return isThisMonth(photoDate);
        case "year":
          return isThisYear(photoDate);
        case "custom":
          if (dateFilter.startDate && dateFilter.endDate) {
            return isWithinInterval(photoDate, {
              start: parseISO(dateFilter.startDate),
              end: parseISO(dateFilter.endDate),
            });
          }
          return true;
        default:
          return true;
      }
    });
  }, [photos, dateFilter]);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleEdit = (photo: Photo) => {
    setSelectedPhoto(photo);
    setEditDialogOpen(true);
    setViewerOpen(false);
  };

  const handleDelete = (photo: Photo) => {
    setSelectedPhoto(photo);
    setDeleteDialogOpen(true);
    setViewerOpen(false);
  };

  const handleImageEdit = (photo: Photo) => {
    setSelectedPhoto(photo);
    setEditorOpen(true);
    setViewerOpen(false);
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredPhotos.length} of {photos.length} photos
        </div>
        <DateFilter onFilterChange={setDateFilter} />
      </div>

      {/* Upload Button - Fixed Position */}
      <button
        onClick={() => setUploadDialogOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full shadow-2xl shadow-rose-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        title="Upload Photo"
      >
        <Upload className="w-7 h-7" />
      </button>

      {/* Empty State or Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700/50">
          <div className="mx-auto w-20 h-20 bg-linear-to-br from-rose-500/10 to-pink-500/10 rounded-full flex items-center justify-center mb-6">
            <ImageIcon className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {photos.length === 0
              ? "No photos yet"
              : "No photos match your filter"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            {photos.length === 0
              ? "Start building your collection of memories by uploading your first photo together."
              : "Try adjusting your date filter to see more photos."}
          </p>
          {photos.length === 0 && (
            <button
              onClick={() => setUploadDialogOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Upload First Photo
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Masonry Grid Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredPhotos.map((photo, index) => {
              return (
                <div
                  key={photo.id}
                  className="break-inside-avoid group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-zinc-700/50 cursor-pointer"
                  onClick={() => openViewer(index)}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100 dark:bg-zinc-900">
                    <Image
                      src={photo.photo_url}
                      alt={photo.caption || "Photo"}
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* linear Overlay - Only on Hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover Info - Only Show on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-xs font-semibold">
                              {photo.uploader?.display_name?.[0] || "?"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {photo.uploader?.display_name || "Unknown"}
                            </p>
                            <p className="text-xs text-white/80">
                              {formatDistanceToNow(new Date(photo.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                            {/* Caption Preview - Always Show if Exists */}
                            {photo.caption && (
                              <p className="text-xs text-white/80">
                                {photo.caption}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Photo Viewer (Lightbox) */}
      <PhotoViewer
        photos={filteredPhotos}
        currentIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImageEdit={handleImageEdit}
        currentUserId={currentUserId}
      />

      {/* Image Editor */}
      {selectedPhoto && (
        <ImageEditor
          isOpen={editorOpen}
          onClose={() => {
            setEditorOpen(false);
            setSelectedPhoto(null);
          }}
          imageUrl={selectedPhoto.photo_url}
          onSave={handleImageSave}
        />
      )}

      {/* Dialogs */}
      <UploadPhotoDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      />

      {selectedPhoto && (
        <>
          <EditPhotoDialog
            isOpen={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedPhoto(null);
            }}
            photo={selectedPhoto}
          />

          <DeletePhotoDialog
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedPhoto(null);
            }}
            photoId={selectedPhoto.id}
          />
        </>
      )}
    </>
  );
}
