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

      <GalleryGrid photos={photos} currentUserId={user.id} />
    </div>
  );
}
