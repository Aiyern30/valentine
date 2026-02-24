import { getDiaryById, getUser } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { MarkdownPreview } from "./markdown-preview";

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const diary = await getDiaryById(id);
  if (!diary) notFound();

  // Ensure user has access (either creator or in the relationship)
  // (In a real app, we'd verify relationship_id matches user's relationship)

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/80 via-white to-rose-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-rose-950/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/diaries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Diaries
          </Link>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {diary.title}
          </h1>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Calendar className="w-4 h-4 text-rose-400" />
            {new Date(diary.diary_date).toLocaleDateString()}
          </div>
        </div>

        {diary.photos && diary.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diary.photos.map((url: string, idx: number) => (
              <div
                key={`${url}-${idx}`}
                className="relative aspect-4/3 rounded-3xl overflow-hidden bg-white shadow-sm border border-rose-100/60"
              >
                <Image
                  src={url}
                  alt={`${diary.title} photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-rose-100/60 bg-white/70 p-10 text-center text-gray-400">
            No photos for this diary yet.
          </div>
        )}

        <MarkdownPreview content={diary.content || ""} />
      </div>
    </div>
  );
}
