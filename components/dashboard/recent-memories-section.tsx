"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PhotoViewer } from "../gallery/photoViewer";
import { DeletePhotoDialog } from "../gallery/deletePhotoDialog";
import { EditPhotoDialog } from "../gallery/editPhotoDialog";
import { ImageEditor } from "../gallery/imageEditor";
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

export function RecentMemoriesSection({
  photos,
  currentUserId,
}: {
  photos: Photo[];
  currentUserId: string;
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const router = useRouter();

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleEdit = (photo: any) => {
    setSelectedPhoto(photo);
    setEditDialogOpen(true);
    setViewerOpen(false);
  };

  const handleDelete = (photo: any) => {
    setSelectedPhoto(photo);
    setDeleteDialogOpen(true);
    setViewerOpen(false);
  };

  const handleImageEdit = (photo: any) => {
    setSelectedPhoto(photo);
    setEditorOpen(true);
    setViewerOpen(false);
  };

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

  return (
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 italic font-dancing">
            Recent Memories
          </h3>
          <button
            onClick={() => router.push("/gallery")}
            className="text-sm text-rose-500 font-medium hover:underline"
          >
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
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="text-white font-medium text-sm backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    View
                  </span>
                </div>
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
            <button
              onClick={() => router.push("/gallery")}
              className="mt-2 text-rose-500 text-sm hover:underline font-medium"
            >
              Upload your first photo
            </button>
          </div>
        )}
      </div>

      <PhotoViewer
        photos={photos as any}
        currentIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImageEdit={handleImageEdit}
        currentUserId={currentUserId}
      />

      {selectedPhoto && (
        <>
          <EditPhotoDialog
            isOpen={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedPhoto(null);
            }}
            photo={selectedPhoto as any}
          />
          <DeletePhotoDialog
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedPhoto(null);
            }}
            photoId={selectedPhoto.id}
          />
          <ImageEditor
            isOpen={editorOpen}
            onClose={() => {
              setEditorOpen(false);
              setSelectedPhoto(null);
            }}
            imageUrl={selectedPhoto.photo_url}
            onSave={handleImageSave}
          />
        </>
      )}
    </>
  );
}
