"use client";

import {
  Question,
  ChoiceOption,
  LinearScaleConfig,
  RatingConfig,
} from "@/types/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface QuizResultsProps {
  quiz: {
    session: any;
    questions: Question[];
    responses: any[];
  };
}

export function QuizResults({ quiz, userId }: { quiz: any; userId: string }) {
  const router = useRouter();
  const { session, questions, responses } = quiz;

  // Find the partner's response (the one that isn't the creator if viewing as creator,
  // or the one that IS the user if viewing as partner)
  const isCreator = session.created_by === userId;

  const getResponseForQuestion = (questionId: string) => {
    return responses.find((r: any) => r.question_id === questionId);
  };

  const renderValue = (question: Question, value: string) => {
    if (!value) return <span className="text-gray-400 italic">No answer</span>;

    if (
      ["multiple_choice", "dropdown", "checkboxes"].includes(
        question.question_type,
      )
    ) {
      const options = question.options as ChoiceOption[];
      const keys = value.split(",");
      const labels = keys.map(
        (k) => options.find((o) => o.key === k)?.label || k,
      );
      return labels.join(", ");
    }

    return value;
  };

  const renderGradedInput = (
    q: Question,
    correctVal: string,
    partnerVal: string,
  ) => {
    const isMatch = correctVal === partnerVal;

    switch (q.question_type) {
      case "multiple_choice":
      case "dropdown":
      case "checkboxes": {
        const options = q.options as ChoiceOption[] | null;
        const correctKeys = correctVal ? correctVal.split(",") : [];
        const partnerKeys = partnerVal ? partnerVal.split(",") : [];

        return (
          <div className="grid grid-cols-1 gap-2 mt-4">
            {options?.map((opt) => {
              const isCorrectTarget = correctKeys.includes(opt.key);
              const isPartnerSelected = partnerKeys.includes(opt.key);

              let stateStyle =
                "bg-white border-rose-100 text-rose-700 opacity-60";
              let icon = null;

              if (isCorrectTarget && isPartnerSelected) {
                stateStyle =
                  "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold opacity-100";
                icon = <CheckCircle2 size={14} className="text-emerald-500" />;
              } else if (isCorrectTarget && !isPartnerSelected) {
                stateStyle =
                  "bg-emerald-50/30 border-emerald-200 text-emerald-800 border-dashed opacity-100";
                icon = <CheckCircle2 size={14} className="text-emerald-300" />;
              } else if (!isCorrectTarget && isPartnerSelected) {
                stateStyle =
                  "bg-rose-50 border-rose-400 text-rose-900 font-bold opacity-100";
                icon = <XCircle size={14} className="text-rose-500" />;
              }

              return (
                <div
                  key={opt.key}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200",
                    stateStyle,
                  )}
                >
                  <span className="text-sm">{opt.label}</span>
                  <div className="flex items-center gap-2">
                    {isCorrectTarget && !isPartnerSelected && (
                      <span className="text-[9px] uppercase font-bold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Should be
                      </span>
                    )}
                    {icon}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      case "linear_scale": {
        const cfg = q.options as LinearScaleConfig;
        const numbers = Array.from(
          { length: cfg.max - cfg.min + 1 },
          (_, i) => cfg.min + i,
        );
        return (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {numbers.map((num) => {
                const sNum = String(num);
                const isCorrect = sNum === correctVal;
                const isPartner = sNum === partnerVal;

                return (
                  <div
                    key={num}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 relative",
                      isCorrect && isPartner
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                        : isCorrect
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700 border-dashed"
                          : isPartner
                            ? "bg-rose-500 border-rose-500 text-white shadow-lg"
                            : "bg-white border-rose-100 text-rose-200",
                    )}
                  >
                    {num}
                    {isPartner && !isCorrect && (
                      <XCircle
                        size={12}
                        className="absolute -top-1 -right-1 text-white bg-rose-600 rounded-full"
                      />
                    )}
                    {isMatch && isCorrect && isPartner && (
                      <CheckCircle2
                        size={12}
                        className="absolute -top-1 -right-1 text-white bg-emerald-600 rounded-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case "rating": {
        const cfg = q.options as RatingConfig;
        const max = cfg.max || 5;
        const partnerRating = parseInt(partnerVal || "0", 10);
        const correctRating = parseInt(correctVal || "0", 10);

        return (
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: max }, (_, i) => i + 1).map((num) => {
              const Icon = cfg.icon === "heart" ? Heart : Star;
              const isPartnerStar = num <= partnerRating;
              const isCorrectStar = num <= correctRating;

              return (
                <Icon
                  key={num}
                  size={32}
                  fill={
                    isPartnerStar
                      ? partnerRating === correctRating
                        ? "#10b981"
                        : "#f43f5e"
                      : "transparent"
                  }
                  className={cn(
                    "transition-colors",
                    isPartnerStar
                      ? partnerRating === correctRating
                        ? "text-emerald-500"
                        : "text-rose-500"
                      : isCorrectStar
                        ? "text-emerald-200"
                        : "text-rose-100",
                  )}
                />
              );
            })}
          </div>
        );
      }
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/50 p-4 rounded-xl border border-rose-50">
              <p className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2">
                {isCreator ? "Your Correct Answer" : "Target Answer"}
              </p>
              <p className="text-rose-950 font-medium">
                {renderValue(q, correctVal)}
              </p>
            </div>
            <div
              className={cn(
                "p-4 rounded-xl border",
                isMatch
                  ? "bg-emerald-50/50 border-emerald-100"
                  : "bg-rose-50 border-rose-100",
              )}
            >
              <p
                className={cn(
                  "text-[10px] uppercase tracking-widest font-bold mb-2",
                  isMatch ? "text-emerald-500" : "text-rose-400",
                )}
              >
                {isCreator ? "Partner's Response" : "Your Response"}
              </p>
              <p
                className={cn(
                  "font-bold",
                  isMatch ? "text-emerald-900" : "text-rose-900",
                )}
              >
                {partnerVal ? renderValue(q, partnerVal) : "No response"}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-100/40 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 right-0 w-[500px] h-[500px] bg-violet-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12 pb-32">
        <SectionHeader
          icon={<Heart className="w-6 h-6 text-white" />}
          title={session.title}
          description={
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-pink-500 text-white rounded-full text-xs font-black shadow-lg shadow-pink-200">
                {Math.round(session.match_score)}% MATCH
              </div>
              <span className="text-rose-400 text-xs font-medium">
                Results Analysis 💕
              </span>
            </div>
          }
          button={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/quiz")}
              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              Dashboard
            </Button>
          }
        />

        <div className="space-y-8 my-8">
          {questions.map((q: Question, i: number) => {
            const resp = getResponseForQuestion(q.id);
            const isMatch = resp?.is_match;

            return (
              <Card
                key={q.id}
                className={cn(
                  "border-none shadow-2xl shadow-rose-200/40 transition-all overflow-hidden relative",
                )}
              >
                {/* Status bar */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1.5",
                    isMatch ? "bg-emerald-400" : "bg-rose-400",
                  )}
                />

                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg border-2",
                        isMatch
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100"
                          : "bg-rose-50 border-rose-100 text-rose-500",
                      )}
                    >
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-bold text-rose-950 leading-snug">
                          {q.question_text}
                        </h3>
                      </div>

                      {renderGradedInput(
                        q,
                        q.correct_option || "",
                        resp?.selected_option || "",
                      )}

                      {!isMatch && (
                        <div className="mt-6 flex items-center gap-2 text-rose-500 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                          <XCircle size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Oops! That wasn't quite it.
                          </span>
                        </div>
                      )}
                      {isMatch && (
                        <div className="mt-6 flex items-center gap-2 text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                          <CheckCircle2 size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Perfect Match! You know each other so well!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Button
            className="bg-rose-950 text-white hover:bg-black px-10 py-6 rounded-2xl font-bold shadow-xl shadow-rose-900/20"
            onClick={() => router.push("/quiz")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
