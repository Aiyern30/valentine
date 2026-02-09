import { createClient } from "@/lib/supabase/server";
import { RelationshipTimer } from "@/components/dashboard/relationship-timer";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { LogOut, Bell, Settings } from "lucide-react";

// Mock start date - normally fetched from DB
const MOCK_START_DATE = "2022-02-14";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back,{" "}
            <span className="text-rose-500">{user?.email?.split("@")[0]}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening in your love life
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            {user?.email?.[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Feature: Timer */}
      <section>
        <RelationshipTimer startDate={MOCK_START_DATE} />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Quick Actions
        </h2>
        <DashboardActions />
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Events */}
        <div className="lg:col-span-2 space-y-8">
          <UpcomingEvents />

          {/* Recent Notes/Gallery Teaser */}
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Memories</h3>
              <button className="text-sm text-rose-500 font-medium hover:underline">
                View Gallery
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gray-100 dark:bg-zinc-900 overflow-hidden relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse" />{" "}
                  {/* Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="text-white font-medium text-xs backdrop-blur-md px-2 py-1 rounded-full">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar / Status */}
        <div className="space-y-6">
          {/* Partner Status Card */}
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-medium opacity-90 mb-4">
                Partner Status
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">
                  ❤️
                </div>
                <div>
                  <p className="font-semibold text-lg">Connected</p>
                  <p className="text-indigo-100 text-sm">Last seen today</p>
                </div>
              </div>
            </div>
            {/* Decor */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Daily Quote/Confession Teaser */}
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-3xl p-6 border border-rose-100 dark:border-rose-900/30">
            <h3 className="text-rose-600 dark:text-rose-400 font-script text-xl mb-3">
              Daily Inspiration
            </h3>
            <p className="italic text-gray-700 dark:text-gray-300 mb-4">
              "In all the world, there is no heart for me like yours. In all the
              world, there is no love for you like mine."
            </p>
            <p className="text-xs text-rose-500 font-medium uppercase tracking-wide">
              — Maya Angelou
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
