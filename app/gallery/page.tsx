import { getUser, getPhotos } from "@/lib/data";
import { redirect } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { GalleryGrid } from "@/components/gallery/galleryGrid";

export default async function GalleryPage() {
  const user = await getUser();

  // Redirect to home if not authenticated
  if (!user) {
    redirect("/");
  }

  // Fetch photos
  const photos = await getPhotos(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            Photo Gallery
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {photos.length} {photos.length === 1 ? "memory" : "memories"}{" "}
            captured
          </p>
        </div>
      </header>

      {/* Gallery Grid */}
      {photos.length > 0 ? (
        <GalleryGrid photos={photos} currentUserId={user.id} />
      ) : (
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
        </div>
      )}
    </div>
  );
}
