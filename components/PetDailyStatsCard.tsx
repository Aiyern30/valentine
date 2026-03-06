"use client";

import { useEffect, useState } from "react";
import { getDailyStats, getDailyStatsRange } from "@/lib/pet-interactions";

interface DailyStats {
  pet_id: string;
  stat_date: string;
  daily_pats: number;
  daily_feeds: number;
  daily_plays: number;
  daily_baths: number;
  play_time_minutes: number;
  sleep_hours: number;
}

interface PetDailyStatsCardProps {
  petId: string;
  petName: string;
}

export default function PetDailyStatsCard({
  petId,
  petName,
}: PetDailyStatsCardProps) {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);

      // Get today's stats
      const todayResult = await getDailyStats(petId);
      if (todayResult.success && todayResult.stats) {
        setTodayStats(todayResult.stats as DailyStats);
      }

      // Get last 7 days stats
      const weekResult = await getDailyStatsRange(petId, 7);
      if (weekResult.success && weekResult.stats) {
        setWeeklyStats(weekResult.stats as DailyStats[]);
      }

      setIsLoading(false);
    }

    fetchStats();
  }, [petId]);

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <p className="text-gray-500">Loading stats...</p>
      </div>
    );
  }

  // Calculate weekly totals
  const weeklyTotals = weeklyStats.reduce(
    (acc, day) => ({
      pats: acc.pats + (day.daily_pats || 0),
      feeds: acc.feeds + (day.daily_feeds || 0),
      plays: acc.plays + (day.daily_plays || 0),
      baths: acc.baths + (day.daily_baths || 0),
      playTime: acc.playTime + (day.play_time_minutes || 0),
      sleepHours: acc.sleepHours + (day.sleep_hours || 0),
    }),
    { pats: 0, feeds: 0, plays: 0, baths: 0, playTime: 0, sleepHours: 0 },
  );

  return (
    <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {petName}&apos;s Activity
      </h3>

      {/* Today's Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          📅 Today&apos;s Activity
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <StatItem
            label="Pats"
            value={todayStats?.daily_pats || 0}
            emoji="🐾"
          />
          <StatItem
            label="Feeds"
            value={todayStats?.daily_feeds || 0}
            emoji="🍖"
          />
          <StatItem
            label="Plays"
            value={todayStats?.daily_plays || 0}
            emoji="🎮"
          />
          <StatItem
            label="Baths"
            value={todayStats?.daily_baths || 0}
            emoji="🛁"
          />
          <StatItem
            label="Play time"
            value={`${todayStats?.play_time_minutes || 0}m`}
            emoji="⏱️"
          />
          <StatItem
            label="Sleep"
            value={`${todayStats?.sleep_hours || 0}h`}
            emoji="💤"
          />
        </div>
      </div>

      {/* This Week's Stats */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          📊 This Week (Last 7 Days)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="Total Pats" value={weeklyTotals.pats} emoji="🐾" />
          <StatItem label="Total Feeds" value={weeklyTotals.feeds} emoji="🍖" />
          <StatItem label="Total Plays" value={weeklyTotals.plays} emoji="🎮" />
          <StatItem label="Total Baths" value={weeklyTotals.baths} emoji="🛁" />
          <StatItem
            label="Play time"
            value={`${weeklyTotals.playTime}m`}
            emoji="⏱️"
          />
          <StatItem
            label="Sleep"
            value={`${weeklyTotals.sleepHours}h`}
            emoji="💤"
          />
        </div>
      </div>

      {/* Daily Breakdown */}
      {weeklyStats.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">
            📈 Daily Breakdown
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {weeklyStats.map((day) => (
              <div
                key={day.stat_date}
                className="flex items-center justify-between text-xs bg-white/50 px-3 py-2 rounded-lg"
              >
                <span className="font-medium text-gray-600">
                  {new Date(day.stat_date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  )}
                </span>
                <span className="text-gray-500">
                  🐾{day.daily_pats} 🍖{day.daily_feeds} 🎮{day.daily_plays} 🛁
                  {day.daily_baths}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({
  label,
  value,
  emoji,
}: {
  label: string;
  value: number | string;
  emoji: string;
}) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
