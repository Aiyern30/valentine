/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDiaries, getUser } from "@/lib/data";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  BookOpen,
  Plus,
  ChevronRight,
  Calendar,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default async function DiariesPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const diaries = await getDiaries(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <SectionHeader
        icon={<BookOpen className="w-6 h-6 text-white" />}
        title={<>Our Love Story</>}
        description={"Every moment we've captured in words"}
        button={
          <Link
            href="/diaries/new"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold shadow-xl shadow-rose-500/25 transition-all hover:-translate-y-1 active:scale-95 w-fit"
          >
            <Plus className="w-5 h-5" />
            Write New Chapter
          </Link>
        }
      />

      {diaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diaries.map((diary: any) => (
            <Link
              key={diary.id}
              href={`/diaries/${diary.id}`}
              className="group bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
            >
              {/* Photo Preview if exists */}
              {diary.photos && diary.photos.length > 0 ? (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={diary.photos[0]}
                    alt={diary.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-zinc-800">
                      {diary.author?.avatar_url ? (
                        <Image
                          src={diary.author.avatar_url}
                          alt="Author"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-500 text-white text-[10px]">
                          {diary.author?.display_name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-white text-xs font-bold drop-shadow-md">
                      {diary.author?.display_name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-linear-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 flex items-center justify-center relative">
                  <BookOpen className="w-12 h-12 text-rose-200 dark:text-rose-900/40" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 overflow-hidden bg-zinc-800">
                      {diary.author?.avatar_url ? (
                        <Image
                          src={diary.author.avatar_url}
                          alt="Author"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-500 text-white text-[10px]">
                          {diary.author?.display_name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 text-xs font-bold">
                      {diary.author?.display_name}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(diary.diary_date), "MMMM do, yyyy")}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-rose-500 transition-colors line-clamp-2">
                  {diary.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                  {diary.content.replace(/[#*`]/g, "")}
                </p>

                <div className="pt-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-medium">Read more</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-rose-500 transition-all group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="min-h-[calc(100vh-250px)] flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-[48px] border-2 border-dashed border-gray-100 dark:border-zinc-800 p-12 px-4 text-center">
          <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            The first page is waiting...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
            You haven't added any diary entries yet. Start capturing your
            special moments today.
          </p>
          <Link
            href="/diaries/new"
            className="px-10 py-4 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold transition-all"
          >
            Start Writing
          </Link>
        </div>
      )}
    </div>
  );
}
