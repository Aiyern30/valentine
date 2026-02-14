import { getUser, getPhotos } from "@/lib/data";
import { redirect } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { GalleryGrid } from "@/components/gallery/galleryGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
      <SectionHeader
        icon={<ImageIcon className="w-6 h-6 text-white" />}
        title={"Photo Gallery"}
        description={`${photos.length} ${photos.length === 1 ? "memory" : "memories"} captured`}
      />
      <GalleryGrid photos={photos} currentUserId={user.id} />
    </div>
  );
}
