"use client";

import { useState } from "react";
import { QAQuestion, submitQAAnswer } from "@/lib/qa-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function QAAnswerForm({ questions }: { questions: any[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleNext = async () => {
    const answer = answers[currentQuestion.id];
    if (!answer?.trim()) {
      toast.error("Please write your answer first 🌸");
      return;
    }

    setIsSubmitting(true);
    const result = await submitQAAnswer(currentQuestion.id, answer);

    if (result.success) {
      if (isLast) {
        toast.success("All questions answered! Well done 💕");
        router.refresh(); // This should trigger the "completed" view
      } else {
        setCurrentIndex((prev) => prev + 1);
        setIsSubmitting(false);
      }
    } else {
      toast.error(result.error || "Failed to save answer");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress */}
      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-1 rounded-full transition-all duration-300",
                i === currentIndex
                  ? "bg-rose-500 w-12"
                  : i < currentIndex
                    ? "bg-emerald-400"
                    : "bg-rose-100",
              )}
            />
          ))}
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-rose-200/50 bg-white/90 backdrop-blur-xl overflow-hidden rounded-3xl">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <MessageCircle className="text-rose-500 w-8 h-8" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
            "{currentQuestion.question_text}"
          </h2>

          <div className="relative group">
            <Textarea
              placeholder="Write your answer from the heart..."
              value={answers[currentQuestion.id] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [currentQuestion.id]: e.target.value,
                }))
              }
              className="min-h-[150px] bg-rose-50/30 border-rose-100 rounded-2xl p-6 text-lg text-gray-700 placeholder:text-rose-300 focus:ring-rose-500/10 focus:border-rose-400 transition-all resize-none"
              disabled={isSubmitting}
            />
            <div className="absolute top-4 right-4 text-rose-200 opacity-30">
              <Heart size={40} className="fill-current" />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0 || isSubmitting}
              className="text-gray-400 hover:text-gray-600 rounded-xl px-6 h-12"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-rose-200 transition-all active:scale-95"
            >
              {isSubmitting
                ? "Saving..."
                : isLast
                  ? "Finish & Submit 💌"
                  : "Next Question"}
              {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center px-6">
        <p className="text-xs text-rose-400 italic">
          "The best answers come from the most honest moments."
        </p>
      </div>
    </div>
  );
}
