"use client";

import { Milestone } from "@/types";
import { Calendar, Flag } from "lucide-react";
import { useState } from "react";
import { CreateEventDialog } from "./create-event-dialog";

export function UpcomingEvents({ milestones }: { milestones: Milestone[] }) {
  console.log("UpcomingEvents milestones:", milestones);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" />
          Upcoming Milestones
          {milestones.length > 0 && (
            <span className="text-sm font-normal text-gray-400">
              (Next {milestones.length})
            </span>
          )}
        </h3>
        {milestones.length >= 5 && (
          <button className="text-sm text-rose-500 font-medium hover:underline">
            View All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <p className="font-medium">No upcoming milestones</p>
            <p className="text-sm mt-1">Create your first milestone below!</p>
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

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {milestone.title}
                </h4>
                {milestone.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                    {milestone.description}
                  </p>
                )}
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

        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full py-3 border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl text-sm text-gray-500 hover:border-rose-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-2"
        >
          <Flag className="w-4 h-4" />
          Add New Milestone
        </button>
      </div>

      <CreateEventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
