"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { addGoalCheckin } from "@/lib/goal-actions";
import { toast } from "sonner";
import { Heart, Sparkles, Smile, Cloud, Zap, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const MOODS = [
  { emoji: "🥰", label: "Loving", color: "bg-rose-100 text-rose-600" },
  { emoji: "💪", label: "Strong", color: "bg-amber-100 text-amber-600" },
  { emoji: "😊", label: "Happy", color: "bg-emerald-100 text-emerald-600" },
  { emoji: "😴", label: "Tired", color: "bg-blue-100 text-blue-600" },
  { emoji: "✨", label: "Inspired", color: "bg-violet-100 text-violet-600" },
];

export function GoalCheckinDialog({
  goalId,
  goalTitle,
  isOpen,
  onOpenChange,
}: {
  goalId: string;
  goalTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState(MOODS[2].emoji);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await addGoalCheckin(goalId, 1, note, selectedMood);

    if (result.success) {
      toast.success("Progress logged beautifully! ✨");
      setNote("");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to log progress");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-rose-100 bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Check-in: {goalTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Mood Selector */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 px-1">
              How are you feeling about this goal?
            </label>
            <div className="flex justify-between gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.emoji}
                  onClick={() => setSelectedMood(mood.emoji)}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2",
                    selectedMood === mood.emoji
                      ? "border-rose-300 scale-110 shadow-lg shadow-rose-100 " +
                          mood.color
                      : "border-gray-50 bg-gray-50/50 text-gray-400 hover:border-rose-100",
                  )}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-[8px] font-bold uppercase">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 px-1">
              Write a heartbeat… (Optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How was your progress today? Share a sweet detail... ✨"
              className="min-h-[100px] rounded-2xl border-rose-100 focus-visible:ring-rose-500/20 bg-rose-50/20 resize-none leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex items-center gap-4">
          <div className="text-[10px] text-gray-400 italic">
            Your partner will see this in your goal history! ❤️
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-11 px-8 rounded-2xl shadow-lg shadow-rose-200"
          >
            {isSubmitting ? "Saving..." : "Log Progress"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
