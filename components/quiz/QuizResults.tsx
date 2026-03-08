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

interface QuizResultsProps {
  quiz: {
    session: any;
    questions: Question[];
    responses: any[];
  };
}

export function QuizResults({ quiz }: QuizResultsProps) {
  const router = useRouter();
  const { session, questions, responses } = quiz;

  const getResponseForQuestion = (questionId: string) => {
    return responses.find((r) => r.question_id === questionId);
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

  return (
    <div className="min-h-screen bg-rose-50/20">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/quiz")}
              className="mb-4 text-rose-600 hover:text-rose-700 hover:bg-rose-100"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {session.title}
            </h1>
            <p className="text-rose-600 mt-2">
              Final Score:{" "}
              <span className="font-bold text-2xl">
                {Math.round(session.match_score)}%
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => {
            const resp = getResponseForQuestion(q.id);
            const isMatch = resp?.is_match;

            return (
              <Card
                key={q.id}
                className={cn(
                  "border-2 transition-all",
                  isMatch
                    ? "border-emerald-100 bg-emerald-50/10"
                    : "border-rose-100 bg-white",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border",
                        isMatch
                          ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                          : "bg-rose-50 border-rose-100 text-rose-500",
                      )}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {q.question_text}
                        </h3>
                        {isMatch ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={12} /> Match
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                            <XCircle size={12} /> Miss
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/50 p-4 rounded-xl border border-rose-50">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2">
                            Creator's Answer
                          </p>
                          <p className="text-rose-950 font-medium">
                            {renderValue(q, q.correct_option)}
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
                            Partner's Answer
                          </p>
                          <p
                            className={cn(
                              "font-bold",
                              isMatch ? "text-emerald-900" : "text-rose-900",
                            )}
                          >
                            {resp
                              ? renderValue(q, resp.selected_option)
                              : "No response"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
