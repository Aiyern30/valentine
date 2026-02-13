"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UploadPhotoDialog } from "./uploadPhotoDialog";
import { DeletePhotoDialog } from "./deletePhotoDialog";
import { EditPhotoDialog } from "./editPhotoDialog";

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleEdit = (photo: Photo) => {
    setSelectedPhoto(photo);
    setEditDialogOpen(true);
    setActiveDropdown(null);
  };

  const handleDelete = (photo: Photo) => {
    setSelectedPhoto(photo);
    setDeleteDialogOpen(true);
    setActiveDropdown(null);
  };

  const toggleDropdown = (photoId: string) => {
    setActiveDropdown(activeDropdown === photoId ? null : photoId);
  };

  return (
    <>
      {/* Upload Button - ALWAYS VISIBLE - Fixed Position */}
      <button
        onClick={() => setUploadDialogOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full shadow-2xl shadow-rose-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        title="Upload Photo"
      >
        <Upload className="w-7 h-7" />
      </button>

      {/* Empty State or Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700/50">
          <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mb-6">
            <ImageIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No photos yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            Start building your collection of memories by uploading your first
            photo together.
          </p>
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Upload className="w-5 h-5" />
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => {
            const isOwner = photo.uploaded_by === currentUserId;

            return (
              <div
                key={photo.id}
                className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-700/50"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-zinc-900">
                  <Image
                    src={photo.photo_url}
                    alt={photo.caption || "Photo"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Action Menu (only for owner) */}
                  {isOwner && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(photo.id)}
                          className="p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-zinc-900 transition-colors shadow-lg"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === photo.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute top-full right-0 mt-2 z-20 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-40 animate-in fade-in slide-in-from-top-2 duration-200">
                              <button
                                onClick={() => handleEdit(photo)}
                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(photo)}
                                className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  {/* Caption */}
                  {photo.caption && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {photo.caption}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      {/* Uploader */}
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{photo.uploader?.display_name || "Unknown"}</span>
                      </div>

                      {/* Date */}
                      {photo.taken_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(photo.taken_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time ago */}
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDistanceToNow(new Date(photo.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
