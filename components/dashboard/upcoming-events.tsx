import { Milestone } from "@/types";
import { Calendar, Flag } from "lucide-react";

export function UpcomingEvents({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" />
          Upcoming Milestones
        </h3>
        {milestones.length > 0 && (
          <button className="text-sm text-rose-500 font-medium hover:underline">
            View All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No upcoming events.</p>
            <p className="text-sm">Time to plan something special!</p>
          </div>
        ) : (
          milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 flex flex-col items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-700 text-xs font-bold leading-none">
                <span className="text-rose-500">
                  {new Date(milestone.milestone_date)
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase()}
                </span>
                <span className="text-lg text-gray-900 dark:text-gray-100">
                  {new Date(milestone.milestone_date).getDate()}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {milestone.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {milestone.description}
                </p>
                {milestone.milestone_type && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-[10px] font-medium uppercase tracking-wide">
                      {milestone.milestone_type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        <button className="w-full py-3 border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl text-sm text-gray-500 hover:border-rose-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-2">
          <Flag className="w-4 h-4" />
          Add New Milestone
        </button>
      </div>
    </div>
  );
}
