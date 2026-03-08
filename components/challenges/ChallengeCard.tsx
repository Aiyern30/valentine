"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  Clock,
  Calendar,
  Heart,
} from "lucide-react";
import { format } from "date-fns";
import {
  Challenge,
  deleteChallenge,
  toggleChallengeCompletion,
} from "@/lib/couple-challenge-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ChallengeCard({
  challenge,
  userId,
  isPartner1,
  onEdit,
}: {
  challenge: Challenge;
  userId: string;
  isPartner1: boolean;
  onEdit?: (c: Challenge) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteChallenge(challenge.id);
    if (result.success) {
      toast.success("Challenge deleted!");
    } else {
      toast.error(result.error || "Failed to delete challenge");
    }
    setIsDeleting(false);
  };

  const handleToggle = async () => {
    setIsToggling(true);
    const currentStatus = isPartner1
      ? challenge.partner1_completed
      : challenge.partner2_completed;
    const partnerNum = isPartner1 ? 1 : 2;
    const result = await toggleChallengeCompletion(
      challenge.id,
      partnerNum,
      !currentStatus,
    );
    if (result.success) {
      toast.success(
        !currentStatus ? "Marked as complete!" : "Marked as incomplete!",
      );
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setIsToggling(false);
  };

  const isCompleted = challenge.status === "completed";
  const myStatus = isPartner1
    ? challenge.partner1_completed
    : challenge.partner2_completed;
  const partnerStatus = isPartner1
    ? challenge.partner2_completed
    : challenge.partner1_completed;

  // Visual Styling (Synchronized with Quiz)
  const borderClass = isCompleted
    ? "border-pink-300 ring-1 ring-pink-100 bg-pink-50/20 shadow-pink-200/40"
    : "border-rose-200 hover:border-rose-300 shadow-rose-200/20";

  const badgeStyles = isCompleted
    ? "bg-pink-500 text-white"
    : challenge.status === "active"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-amber-100 text-amber-700 border border-amber-200";

  return (
    <Card
      className={cn(
        "bg-white/95 transition-all shadow-xl rounded-2xl overflow-hidden",
        borderClass,
      )}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-rose-900 line-clamp-2">
              {challenge.title}
            </h3>
            {challenge.description && (
              <p className="text-sm text-rose-500 line-clamp-2 mt-1 italic">
                {challenge.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm",
                badgeStyles,
              )}
            >
              {isCompleted ? "Fully Completed" : challenge.status}
            </span>
            <div className="flex gap-1">
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest font-bold",
                  challenge.difficulty === "easy"
                    ? "text-emerald-500"
                    : challenge.difficulty === "medium"
                      ? "text-amber-500"
                      : "text-rose-500",
                )}
              >
                {challenge.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] uppercase text-rose-400 font-bold">
                You
              </span>
              <button
                onClick={handleToggle}
                disabled={isToggling}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  myStatus
                    ? "bg-pink-500 text-white scale-110"
                    : "bg-white text-rose-200 border-2 border-rose-100 hover:border-pink-300 hover:text-pink-300",
                )}
              >
                {myStatus ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
            </div>

            <div className="h-10 w-px bg-rose-200 rotate-12" />

            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] uppercase text-rose-400 font-bold">
                Partner
              </span>
              <div
                className={cn(
                  "p-2 rounded-full",
                  partnerStatus ? "text-pink-400" : "text-rose-100",
                )}
              >
                {partnerStatus ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Circle size={24} />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium border-t border-rose-100 pt-3 text-rose-500">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-rose-400" />
              <span>
                {challenge.duration_days} day
                {challenge.duration_days !== 1 ? "s" : ""}
              </span>
            </div>
            {challenge.due_at && (
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-rose-400" />
                <span>Due: {format(new Date(challenge.due_at), "MMM d")}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-rose-300 hover:text-rose-600 hover:bg-rose-50"
              onClick={() => onEdit?.(challenge)}
            >
              <Edit2 size={16} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-rose-300 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[32px] border-rose-100 shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-rose-900 font-dancing text-2xl italic">
                    Delete Challenge?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-rose-600">
                    This will remove this shared challenge forever. Are you sure
                    you want to let go of this flame?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="rounded-2xl bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    {isDeleting ? "Deleting..." : "Delete it"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
