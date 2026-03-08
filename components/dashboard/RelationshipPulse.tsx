"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  MessageSquareHeart,
  Sparkles,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PulseProps {
  data: {
    goalsCount: number;
    completedGoalsCount: number;
    qaCount: number;
    latestCheckin: {
      mood: string;
      note: string;
      profiles: { display_name: string };
      shared_goals: { title: string };
    } | null;
    pendingQACount: number;
  } | null;
}

export function RelationshipPulse({ data }: PulseProps) {
  if (!data) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          Relationship Pulse
        </h2>
        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
          Live Updates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goals Progress Card */}
        <Link href="/shared_goals" className="block group">
          <Card className="h-full border-none shadow-premium hover:shadow-xl transition-all duration-300 bg-linear-to-br from-rose-500 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <Target size={120} />
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Target size={20} className="text-white" />
                </div>
                <TrendingUp size={16} className="text-white/60" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-rose-100">
                  Shared Dreams
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black">{data.goalsCount}</h4>
                  <span className="text-xs text-rose-100/80 font-bold uppercase tracking-tighter">
                    Current
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center group-hover:px-1 transition-all">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-100/70">
                  {data.completedGoalsCount} Celebrated
                </p>
                <ArrowRight size={14} className="text-white" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Q&A Stats Card */}
        <Link href="/qa_questions" className="block group">
          <Card className="h-full border-none shadow-premium hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 border border-rose-50 dark:border-zinc-800 overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform text-rose-600">
              <MessageSquareHeart size={120} />
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-xl">
                  <MessageSquareHeart size={20} className="text-rose-500" />
                </div>
                {data.pendingQACount > 0 && (
                  <span className="bg-amber-400 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full animate-bounce shadow-lg shadow-amber-200">
                    New for you
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-tighter">
                  Q&A Heartbeats
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black text-gray-800 dark:text-gray-100">
                    {data.qaCount}
                  </h4>
                  <span className="text-xs text-rose-400 font-bold uppercase tracking-tighter italic">
                    Deep Thoughts
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-zinc-800 flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {data.pendingQACount} Pending Response
                </p>
                <ArrowRight size={14} className="text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Latest Heartbeat Card (Habit/Goal log) */}
        {data.latestCheckin ? (
          <div className="md:col-span-2">
            <Card className="h-full border-none shadow-premium bg-white dark:bg-zinc-900 border border-rose-50 dark:border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
              <CardContent className="p-5 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                      <Sparkles size={16} className="text-sky-500" />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Latest Shared Moment
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                    <TrendingUp size={10} /> Live Heartbeat
                  </span>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/30 dark:bg-rose-950/20 border border-rose-100/30">
                  <span className="text-3xl filter drop-shadow-md shrink-0 bg-white dark:bg-zinc-800 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm border border-rose-50">
                    {data.latestCheckin.mood}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold text-rose-600">
                        {data.latestCheckin.profiles.display_name}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        logged persistence for
                      </span>
                    </div>
                    <h6 className="text-sm font-black text-gray-800 dark:text-gray-100 truncate mb-2">
                      {data.latestCheckin.shared_goals.title}
                    </h6>
                    <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-2">
                      "
                      {data.latestCheckin.note ||
                        "Sending love without words today..."}
                      "
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="md:col-span-2">
            <Card className="h-full border-dashed border-2 border-rose-100 dark:border-rose-900 items-center justify-center flex p-8 text-center bg-rose-50/20">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <HeartFill size={20} className="text-rose-400" />
                </div>
                <div>
                  <h5 className="font-bold text-rose-900 dark:text-rose-100">
                    No Check-ins Yet!
                  </h5>
                  <p className="text-xs text-rose-500">
                    Log a habit or goal today to see it here! ✨
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}

// Simple Icon Fallback for HeartFill if using Lucide
function HeartFill({ className, size }: { className?: string; size?: number }) {
  return <Activity size={size} className={className} />;
}
