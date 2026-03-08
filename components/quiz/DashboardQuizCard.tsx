"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit2, Users, Check, X, Heart } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { QuizDeleteButton } from "./QuizDeleteButton";
import { updateQuizTitle, QuizSession } from "@/lib/quiz-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DashboardQuizCard({
  quiz,
  userId,
  isPartnerQuiz = false,
}: {
  quiz: QuizSession;
  userId: string;
  isPartnerQuiz?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(quiz.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleUpdate = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle === quiz.title) {
      setTitle(quiz.title);
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    const result = await updateQuizTitle(quiz.id, trimmedTitle);
    if (result.success) {
      toast.success("Title updated!");
    } else {
      toast.error(result.error || "Failed to update title");
      setTitle(quiz.title);
    }
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUpdate();
    if (e.key === "Escape") {
      setTitle(quiz.title);
      setIsEditing(false);
    }
  };

  const isCreator = quiz.created_by === userId;
  const isCompleted = quiz.match_score !== null || quiz.completed_at !== null;
  const isDraft = quiz.status === "draft";

  // Visual Styling based on status and partner/creator
  const borderClass = isCompleted
    ? isPartnerQuiz
      ? "border-violet-300 ring-1 ring-violet-100 bg-violet-50/30"
      : "border-pink-300 ring-1 ring-pink-100 bg-pink-50/20 shadow-pink-200/40"
    : isPartnerQuiz
      ? "border-violet-200 hover:border-violet-300 shadow-violet-200/20"
      : "border-rose-200 hover:border-rose-300 shadow-rose-200/20";

  const textClass = isPartnerQuiz ? "text-violet-900" : "text-rose-900";
  const subTextClass = isPartnerQuiz ? "text-violet-500" : "text-rose-500";

  // Status Badge Styles
  const badgeStyles = isCompleted
    ? isPartnerQuiz
      ? "bg-violet-500 text-white"
      : "bg-pink-500 text-white"
    : isDraft
      ? "bg-amber-100 text-amber-700 border border-amber-200"
      : "bg-emerald-100 text-emerald-700 border border-emerald-200";

  return (
    <Card className={cn("bg-white/95 transition-all shadow-xl", borderClass)}>
      <CardContent className="p-5 flex flex-col h-full min-h-[180px]">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdate}
                  onKeyDown={handleKeyDown}
                  disabled={isUpdating}
                  className={cn(
                    "h-10 py-1 text-lg font-bold border-2 focus-visible:ring-offset-0",
                    isPartnerQuiz
                      ? "text-violet-900 border-violet-300 focus-visible:ring-violet-400"
                      : "text-rose-900 border-rose-300 focus-visible:ring-pink-400",
                  )}
                />
              </div>
            ) : (
              <h3
                className={cn(
                  "font-bold text-lg line-clamp-2 cursor-pointer transition-colors flex items-center gap-2 group",
                  isPartnerQuiz
                    ? "text-violet-900 hover:text-violet-600"
                    : "text-rose-900 hover:text-pink-600",
                )}
                onClick={() => isCreator && !isCompleted && setIsEditing(true)}
              >
                {quiz.title}
                {isCreator && !isCompleted && (
                  <Edit2
                    size={12}
                    className="opacity-0 group-hover:opacity-100 text-rose-400 transition-opacity shrink-0"
                  />
                )}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCompleted && (
              <div className="flex -space-x-1 mr-1">
                {[1, 2, 3].map((i) => (
                  <Heart
                    key={i}
                    size={10}
                    className={cn(
                      "animate-pulse",
                      isPartnerQuiz ? "text-violet-400" : "text-pink-400",
                    )}
                    fill="currentColor"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm",
                badgeStyles,
              )}
            >
              {isCompleted
                ? quiz.match_score !== null
                  ? `${Math.round(quiz.match_score)}% Score`
                  : "Completed"
                : isDraft
                  ? "Draft"
                  : "Published"}
            </span>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div
            className={cn(
              "flex items-center justify-between text-[11px] font-medium border-b pb-3",
              subTextClass,
              isPartnerQuiz ? "border-violet-100" : "border-rose-100",
            )}
          >
            <span>{quiz.total_questions} Questions</span>
            <span>{format(new Date(quiz.created_at), "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 flex-1">
              {isPartnerQuiz ? (
                <Link
                  href={isCompleted ? `/quiz/${quiz.id}` : `/quiz/${quiz.id}`}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200"
                  >
                    {isCompleted ? (
                      <>
                        <Users size={14} className="mr-2" />
                        View Results
                      </>
                    ) : (
                      <>
                        <Play size={14} className="mr-2" />
                        Play Quiz
                      </>
                    )}
                  </Button>
                </Link>
              ) : (
                <Link
                  href={isCompleted ? `/quiz/${quiz.id}` : `/quiz/${quiz.id}`}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "w-full border-rose-200 text-rose-700 hover:bg-rose-50",
                      isCompleted && "bg-pink-50 border-pink-200",
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <Users size={14} className="mr-2" />
                        View Results
                      </>
                    ) : (
                      <>
                        <Edit2 size={14} className="mr-2" />
                        Edit Quiz
                      </>
                    )}
                  </Button>
                </Link>
              )}
            </div>

            {isCreator && !isCompleted && <QuizDeleteButton id={quiz.id} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
