"use client";

import { SharedGoal, updateSharedGoal } from "@/lib/goal-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, History, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GoalCheckinDialog } from "./GoalCheckinDialog";
import { createClient } from "@/lib/supabase/client";

const CATEGORY_STYLES: Record<string, { color: string; icon: string }> = {
  health: { color: "from-rose-400 to-pink-500", icon: "💪" },
  finance: { color: "from-amber-400 to-orange-500", icon: "💰" },
  travel: { color: "from-sky-400 to-blue-500", icon: "✈️" },
  lifestyle: { color: "from-emerald-400 to-teal-500", icon: "🌿" },
  learning: { color: "from-violet-400 to-purple-500", icon: "📚" },
};

export function GoalCard({
  goal,
  userId,
}: {
  goal: SharedGoal;
  userId: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const style = CATEGORY_STYLES[goal.category] || CATEGORY_STYLES.lifestyle;

  const isCompleted = goal.status === "completed";

  // Fetch check-ins for this goal
  useEffect(() => {
    if (showHistory) {
      const fetchHistory = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("goal_checkins")
          .select("*, profiles(display_name, avatar_url)")
          .eq("goal_id", goal.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (data) setHistory(data);
      };
      fetchHistory();
    }
  }, [showHistory, goal.id]);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    const newStatus = isCompleted ? "active" : "completed";
    const result = await updateSharedGoal(goal.id, {
      status: newStatus,
      completed_at: newStatus === "completed" ? new Date().toISOString() : null,
    });

    if (result.success) {
      toast.success(
        newStatus === "completed"
          ? "Goal achieved! 🎉"
          : "Goal reactivated! 🌱",
      );
    } else {
      toast.error("Failed to update goal");
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-3">
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-none shadow-xl",
          isCompleted
            ? "bg-white/40 grayscale-[0.3]"
            : "bg-white/90 hover:scale-[1.01]",
        )}
      >
        {/* Top Banner with Category Color */}
        <div className={cn("h-1.5 w-full bg-linear-to-r", style.color)} />

        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm bg-linear-to-br transition-transform group-hover:rotate-6",
                  style.color,
                  "bg-opacity-10 text-white",
                )}
              >
                {style.icon}
              </div>
              <div>
                <h3
                  className={cn(
                    "font-bold text-lg leading-snug",
                    isCompleted
                      ? "text-gray-400 line-through"
                      : "text-gray-800",
                  )}
                >
                  {goal.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  <span>{goal.goal_type}</span>
                  {goal.frequency && (
                    <>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{goal.frequency}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                  isCompleted
                    ? "bg-emerald-50 border-emerald-100 text-emerald-500"
                    : "bg-rose-50 border-rose-100 text-rose-500",
                )}
              >
                {isCompleted ? "Achieved" : "Building"}
              </span>
            </div>
          </div>

          {goal.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 italic leading-relaxed">
              "{goal.description}"
            </p>
          )}

          {/* Progress Section */}
          <div
            className="space-y-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowHistory(!showHistory)}
          >
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              <span className="flex items-center gap-1">
                <History size={10} />
                Check-ins {history.length > 0 && `(${history.length})`}
              </span>
              <span>{isCompleted ? "100%" : "Tap for history"}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000 bg-linear-to-r",
                  style.color,
                )}
                style={{ width: isCompleted ? "100%" : "35%" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
                  Started
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  {format(new Date(goal.start_date), "MMM d")}
                </span>
              </div>
              {goal.end_date && (
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
                    Target
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    {format(new Date(goal.end_date), "MMM d")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isCompleted && goal.goal_type === "habit" && (
                <Button
                  size="sm"
                  onClick={() => setIsCheckinOpen(true)}
                  disabled={isUpdating}
                  className="bg-white hover:bg-rose-50 border border-rose-100 text-rose-500 font-bold h-8 px-3 rounded-lg text-[11px]"
                >
                  <Plus size={14} className="mr-1" /> Log Today
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleToggleComplete}
                disabled={isUpdating}
                className={cn(
                  "h-8 px-4 rounded-lg font-bold text-[11px] shadow-sm transition-all",
                  isCompleted
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-500"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-200",
                )}
              >
                {isCompleted ? "Unarchive" : "Mark as Done"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List (Collapsible) */}
      {showHistory && (
        <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-rose-50 p-4 shadow-inner space-y-3 animate-in slide-in-from-top-2 duration-300">
          <h4 className="text-[10px] uppercase tracking-widest font-black text-rose-300 flex items-center gap-2 mb-2">
            <Clock size={12} /> Recent Heartbeats
          </h4>

          {history.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-4">
              No check-ins yet. Be the first! ✨
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-start bg-white/60 p-3 rounded-xl border border-white shadow-sm"
                >
                  <span className="text-lg bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                    {item.mood}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-bold text-gray-500">
                        {item.profiles?.display_name || "Someone special"}
                      </span>
                      <span className="text-[8px] text-gray-400 uppercase font-bold">
                        {format(new Date(item.created_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      {item.note || "No message shared."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Checkin Dialog */}
      <GoalCheckinDialog
        goalId={goal.id}
        goalTitle={goal.title}
        isOpen={isCheckinOpen}
        onOpenChange={setIsCheckinOpen}
      />
    </div>
  );
}
