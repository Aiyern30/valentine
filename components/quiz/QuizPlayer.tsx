"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitQuizResponses } from "@/lib/quiz-actions";
import {
  Question,
  ChoiceOption,
  LinearScaleConfig,
  RatingConfig,
} from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Send,
  CheckCircle2,
  Star,
  MessageCircleQuestion,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QuizPlayerProps {
  quiz: { id: string; title: string; questions: Question[] };
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleResponse = (qid: string, val: string) => {
    setResponses((prev) => ({ ...prev, [qid]: val }));
  };

  const handleCheckboxToggle = (qid: string, key: string) => {
    const current = responses[qid] ? responses[qid].split(",") : [];
    let next;
    if (current.includes(key)) {
      next = current.filter((k) => k !== key);
    } else {
      next = [...current, key];
    }
    // Sort to ensure match logic works (A,B is same as B,A)
    handleResponse(qid, next.sort().join(","));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = Object.entries(responses).map(([qid, val]) => ({
      question_id: qid,
      selected_option: val,
    }));

    try {
      const res = await submitQuizResponses(quiz.id, payload);
      if (res.success) {
        setScore(res.matchScore || 0);
        toast.success("Quiz submitted successfully!");
      } else {
        toast.error(res.error || "Failed to submit answers.");
      }
    } catch (e) {
      toast.error("Error submitting answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (score !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30 p-4">
        <Card className="max-w-md w-full text-center border-rose-200 shadow-xl">
          <CardContent className="pt-10 pb-10 px-6">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-pink-500" />
            </div>
            <h2 className="text-3xl font-bold text-rose-900 mb-2">
              Quiz Completed!
            </h2>
            <p className="text-rose-600 mb-8">
              You scored{" "}
              <span className="font-bold text-pink-500 text-xl">
                {Math.round(score)}%
              </span>{" "}
              match!
            </p>
            <Button
              className="w-full bg-pink-600 hover:bg-pink-500 text-white"
              onClick={() => router.push("/quiz")}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderInput = (question: Question) => {
    const val = responses[question.id] || "";

    switch (question.question_type) {
      case "short_answer":
        return (
          <Input
            value={val}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="bg-rose-50/70 border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      case "paragraph":
        return (
          <Textarea
            value={val}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your long answer here..."
            rows={4}
            className="bg-rose-50/70 border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      case "multiple_choice": {
        const options = question.options as ChoiceOption[] | null;
        return (
          <div className="grid grid-cols-1 gap-2">
            {options?.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleResponse(question.id, opt.key)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left",
                  val === opt.key
                    ? "bg-pink-50 border-pink-400 text-pink-900 font-medium"
                    : "bg-white border-rose-100 hover:border-rose-300 text-rose-700",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    val === opt.key ? "border-pink-500" : "border-rose-300",
                  )}
                >
                  {val === opt.key && (
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />
                  )}
                </div>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        );
      }
      case "checkboxes": {
        const options = question.options as ChoiceOption[] | null;
        const selected = val ? val.split(",") : [];
        return (
          <div className="grid grid-cols-1 gap-2">
            {options?.map((opt) => {
              const checked = selected.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => handleCheckboxToggle(question.id, opt.key)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left",
                    checked
                      ? "bg-pink-50 border-pink-400 text-pink-900 font-medium"
                      : "bg-white border-rose-100 hover:border-rose-300 text-rose-700",
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-[4px] border-2 flex items-center justify-center shrink-0",
                      checked
                        ? "border-pink-500 bg-pink-500"
                        : "border-rose-300",
                    )}
                  >
                    {checked && (
                      <div className="w-2.5 h-2.5 bg-white scale-x-[0.5] scale-y-[0.8] rotate-45 border-b-2 border-r-2" />
                    )}
                  </div>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        );
      }
      case "dropdown": {
        const options = question.options as ChoiceOption[] | null;
        return (
          <select
            value={val}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2.5 text-rose-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          >
            <option value="" disabled>
              Select an option
            </option>
            {options?.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }
      case "linear_scale": {
        const cfg = question.options as LinearScaleConfig;
        const numbers = Array.from(
          { length: cfg.max - cfg.min + 1 },
          (_, i) => cfg.min + i,
        );
        return (
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {numbers.map((num) => {
                const checked = val === String(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleResponse(question.id, String(num))}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all border-2",
                      checked
                        ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30"
                        : "bg-white border-rose-200 text-rose-600 hover:border-pink-300",
                    )}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-rose-400 font-bold uppercase tracking-wider mt-2">
              <span>{cfg.min_label}</span>
              <span>{cfg.max_label}</span>
            </div>
          </div>
        );
      }
      case "rating": {
        const cfg = question.options as RatingConfig;
        const max = cfg.max || 5;
        const currentRating = val ? parseInt(val, 10) : 0;
        return (
          <div className="flex items-center gap-2">
            {Array.from({ length: max }, (_, i) => i + 1).map((num) => {
              const active = num <= currentRating;
              const Icon = cfg.icon === "heart" ? Heart : Star;
              return (
                <button
                  key={num}
                  onClick={() => handleResponse(question.id, String(num))}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Icon
                    fill={active ? "#ec4899" : "transparent"}
                    className={cn(
                      "w-10 h-10 transition-colors duration-200",
                      active
                        ? "text-pink-500"
                        : "text-rose-200 hover:text-pink-300",
                    )}
                  />
                </button>
              );
            })}
          </div>
        );
      }
      case "date":
        return (
          <Input
            type="date"
            value={val}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="bg-rose-50/70 border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      case "time":
        return (
          <Input
            type="time"
            value={val}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="bg-rose-50/70 border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      default:
        return null;
    }
  };

  const completedCount = quiz.questions.filter((q) => !!responses[q.id]).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-violet-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-32">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2 justify-between">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-pink-500" fill="currentColor" />
              <span className="text-xs text-rose-500 uppercase tracking-widest font-medium">
                双人默契大比拼
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/quiz")}
              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              Cancel
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {quiz.title || "Untitle Quiz"}
          </h1>
          <p className="text-rose-600 text-sm">
            Show your partner how well you know them! Answer all questions
            below. 💕
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {quiz.questions.map((q, i) => (
            <Card
              key={q.id}
              className="bg-white/95 border-rose-200 shadow-xl shadow-rose-200/20 hover:border-rose-300 transition-all group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center pt-1 px-1">
                    <span className="text-sm font-bold text-rose-400 w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-rose-950 mb-6 leading-relaxed">
                      {q.question_text || "Untitled Question"}
                    </h3>
                    <div className="mt-2">{renderInput(q)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-rose-200 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageCircleQuestion size={15} className="text-rose-500" />
            <span className="text-sm text-rose-500">
              <span className="text-rose-800 font-semibold">
                {completedCount}
              </span>
              /{quiz.questions.length} answered
            </span>
            {completedCount === quiz.questions.length && (
              <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                <Sparkles size={12} /> Ready to go!
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || completedCount < quiz.questions.length}
            className="bg-pink-600 hover:bg-pink-500 text-white font-semibold px-8 shadow-lg shadow-pink-900/40 disabled:opacity-40"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={13} />
                Submit Answers
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
