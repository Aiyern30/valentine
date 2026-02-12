"use client";

import { format } from "date-fns";
import {
  Heart,
  Gift,
  Calendar,
  Star,
  MapPin,
  MoreVertical,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  milestone_date: string;
  category?: string;
  location?: string;
}

interface MilestonesListProps {
  milestones: Milestone[];
}

export function MilestonesList({ milestones }: MilestonesListProps) {
  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "anniversary":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "birthday":
        return <Gift className="w-5 h-5 text-purple-500" />;
      case "date":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      default:
        return <Star className="w-5 h-5 text-rose-500" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "anniversary":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30";
      case "birthday":
        return "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/30";
      case "date":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30";
      default:
        return "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30";
    }
  };

  // Sort milestones by date
  const sortedMilestones = [...milestones].sort(
    (a, b) =>
      new Date(b.milestone_date).getTime() -
      new Date(a.milestone_date).getTime(),
  );

  if (milestones.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
          <Star className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No milestones yet
        </p>
        <button className="mt-2 text-rose-500 text-sm hover:underline font-medium">
          Create your first milestone
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedMilestones.map((milestone) => (
        <div
          key={milestone.id}
          className={`p-4 rounded-xl border transition-all hover:shadow-md ${getCategoryColor(
            milestone.category,
          )}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg mt-1">
                {getCategoryIcon(milestone.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {milestone.title}
                </h3>
                {milestone.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {milestone.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(milestone.milestone_date), "MMM d, yyyy")}
                  </span>
                  {milestone.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {milestone.location}
                    </span>
                  )}
                  {milestone.category && (
                    <span className="px-2 py-0.5 bg-white dark:bg-zinc-800 rounded-full text-xs font-medium capitalize">
                      {milestone.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
