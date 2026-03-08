"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit2, MessageCircle, Heart, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { QASession, deleteQASession } from "@/lib/qa-actions";

export function DashboardQACard({
  session,
  userId,
  isPartnerQA = false,
}: {
  session: QASession;
  userId: string;
  isPartnerQA?: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const isCreator = session.created_by === userId;
  const isCompleted = session.status === "completed";
  const isDraft = session.status === "draft";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this Q&A?")) return;
    setIsDeleting(true);
    const result = await deleteQASession(session.id);
    if (result.success) {
      toast.success("Q&A deleted!");
    } else {
      toast.error(result.error || "Failed to delete");
      setIsDeleting(false);
    }
  };

  // Visual Styling
  const borderClass = isCompleted
    ? isPartnerQA
      ? "border-amber-300 ring-1 ring-amber-100 bg-amber-50/30"
      : "border-rose-300 ring-1 ring-rose-100 bg-rose-50/20 shadow-rose-200/40"
    : isPartnerQA
      ? "border-amber-200 hover:border-amber-300 shadow-amber-200/20"
      : "border-rose-200 hover:border-rose-300 shadow-rose-200/20";

  const textClass = isPartnerQA ? "text-amber-900" : "text-rose-900";
  const subTextClass = isPartnerQA ? "text-amber-500" : "text-rose-500";

  const badgeStyles = isCompleted
    ? isPartnerQA
      ? "bg-amber-500 text-white"
      : "bg-rose-500 text-white"
    : isDraft
      ? "bg-zinc-100 text-zinc-700 border border-zinc-200"
      : "bg-emerald-100 text-emerald-700 border border-emerald-200";

  return (
    <Card
      className={cn(
        "bg-white/95 transition-all shadow-xl backdrop-blur-sm",
        borderClass,
      )}
    >
      <CardContent className="p-5 flex flex-col h-full min-h-[160px]">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-bold text-lg line-clamp-2", textClass)}>
              {session.title || "Untitled Heartfelt Q&A"}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCompleted && (
              <Heart
                size={14}
                className={cn(
                  "animate-pulse",
                  isPartnerQA ? "text-amber-400" : "text-rose-400",
                )}
                fill="currentColor"
              />
            )}
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm",
                badgeStyles,
              )}
            >
              {session.status}
            </span>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div
            className={cn(
              "flex items-center justify-between text-[11px] font-medium border-b pb-3",
              subTextClass,
              isPartnerQA ? "border-amber-100" : "border-rose-100",
            )}
          >
            <span>{session.total_questions} Questions</span>
            <span>{format(new Date(session.created_at), "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 flex-1">
              <Link href={`/qa_questions/${session.id}`} className="flex-1">
                <Button
                  size="sm"
                  variant={isPartnerQA && !isCompleted ? "default" : "outline"}
                  className={cn(
                    "w-full shadow-sm transition-all",
                    isPartnerQA && !isCompleted
                      ? "bg-amber-600 hover:bg-amber-700 text-white border-none"
                      : isPartnerQA
                        ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                        : "border-rose-200 text-rose-700 hover:bg-rose-50",
                    isCompleted && (isPartnerQA ? "bg-amber-50" : "bg-rose-50"),
                  )}
                >
                  {isCompleted ? (
                    <>
                      <MessageCircle size={14} className="mr-2" />
                      View Answers
                    </>
                  ) : isPartnerQA ? (
                    <>
                      <Play size={14} className="mr-2" />
                      Answer Now
                    </>
                  ) : (
                    <>
                      <Edit2 size={14} className="mr-2" />
                      Edit Q&A
                    </>
                  )}
                </Button>
              </Link>
            </div>

            {isCreator && !isCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
