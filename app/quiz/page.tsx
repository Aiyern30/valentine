/* eslint-disable react/no-unescaped-entities */
"use client";

/**
 * Install once:
 *   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
 */

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitQuiz } from "@/lib/quiz-actions";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Heart,
  MessageCircleQuestion,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { QuestionEditor } from "@/components/quiz/questionEditor";
import { TypeDropdown } from "@/components/quiz/sharedUI";
import {
  Question,
  QuestionType,
  ChoiceOption,
  makeDefaultsForType,
  makeDefaultQuestion,
} from "@/types/quiz";

// ─── Question Card Inner (shared between sortable + overlay) ──────────────────

function QuestionCardInner({
  question,
  index,
  onUpdate,
  onDelete,
  isDragging = false,
  dragHandleProps,
}: {
  question: Question;
  index: number;
  onUpdate: (q: Question) => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const handleTypeChange = (type: QuestionType) => {
    onUpdate({
      ...question,
      question_type: type,
      ...makeDefaultsForType(type),
    });
  };

  return (
    <Card
      className={cn(
        "border transition-all duration-200 group",
        isDragging
          ? "bg-rose-50 border-pink-400/70 shadow-2xl shadow-pink-300/40 scale-[1.02] opacity-95 cursor-grabbing"
          : "bg-white/95 border-rose-200 shadow-xl shadow-rose-200/30 hover:border-rose-300",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div
            {...dragHandleProps}
            className={cn(
              "flex flex-col items-center gap-1.5 pt-1 shrink-0 select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab",
            )}
          >
            <GripVertical
              size={16}
              className={cn(
                "transition-colors",
                isDragging
                  ? "text-pink-400"
                  : "text-rose-300 group-hover:text-rose-500",
              )}
            />
            <span className="text-xs font-bold text-rose-400 w-5 text-center">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Type switcher + delete */}
            <div className="flex items-center justify-between mb-3">
              <TypeDropdown
                value={question.question_type}
                onChange={handleTypeChange}
              />
              <button
                onClick={onDelete}
                className="text-rose-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Question text */}
            <textarea
              value={question.question_text}
              onChange={(e) =>
                onUpdate({ ...question, question_text: e.target.value })
              }
              placeholder="Type your question here..."
              rows={2}
              className="w-full bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2 text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20 resize-none leading-relaxed mb-1"
            />

            {/* Type-specific editor */}
            {!isDragging && (
              <QuestionEditor question={question} onUpdate={onUpdate} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableQuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
}: {
  question: Question;
  index: number;
  onUpdate: (q: Question) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Invisible placeholder while dragging — real card shown in DragOverlay
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionCardInner
        question={question}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isDragging={false}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function QuizBuilderPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    makeDefaultQuestion(),
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [titleError, setTitleError] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // dnd-kit sensors — Pointer for mouse/touch, Keyboard for a11y
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px movement before drag starts so clicks still work
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeQuestion = questions.find((q) => q.id === activeId) ?? null;

  // ── Drag handlers ────────────────────────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    setQuestions((prev) => {
      const oldIndex = prev.findIndex((q) => q.id === active.id);
      const newIndex = prev.findIndex((q) => q.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);

      // ── Persist to Supabase ──────────────────────────────────────────────────
      // Option A: call the SQL function (recommended — single round-trip)
      //
      // await supabase.rpc("reorder_quiz_questions", {
      //   p_session_id: sessionId,
      //   p_ordered_ids: reordered.map((q) => q.id),
      // });
      //
      // Option B: bulk upsert display_order
      //
      // await supabase.from("quiz_questions").upsert(
      //   reordered.map((q, i) => ({ id: q.id, display_order: i })),
      //   { onConflict: "id" }
      // );

      return reordered;
    });
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  const addQuestion = () =>
    setQuestions((prev) => [...prev, makeDefaultQuestion()]);

  const updateQuestion = (id: string, updated: Question) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));

  const deleteQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // ── Publish ──────────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!title.trim()) {
      setTitleError("Quiz title is required");
      titleInputRef.current?.focus();
      return;
    }
    setTitleError("");

    setIsPublishing(true);

    try {
      const result = await submitQuiz(title, questions, "published");

      if (result.success) {
        alert("Quiz created successfully! 🎉");
        router.push("/dashboard");
      } else {
        alert(result.error || "Failed to publish quiz");
      }
    } catch (e) {
      alert("An unexpected error occurred.");
    } finally {
      setIsPublishing(false);
    }
  };

  const isQuestionReady = (q: Question) => {
    if (!q.question_text.trim() || !q.correct_option) return false;

    if (
      ["multiple_choice", "checkboxes", "dropdown"].includes(q.question_type)
    ) {
      const opts = q.options as ChoiceOption[];
      if (!opts || opts.length < 2) return false;
      if (opts.some((o) => !o.label.trim())) return false;
    }

    return true;
  };

  const completedCount = questions.filter(isQuestionReady).length;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-100 h-75 bg-violet-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-32">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} className="text-pink-500" fill="currentColor" />
            <span className="text-xs text-rose-500 uppercase tracking-widest font-medium">
              双人默契大比拼
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Create a Quiz
          </h1>
          <p className="text-rose-600 text-sm">
            Write questions for your partner — let's see how well they know you
            💕
          </p>
        </div>

        {/* Quiz title */}
        <div className="mb-8">
          <Label className="text-xs text-rose-500 uppercase tracking-wider mb-2 block">
            Quiz Title <span className="text-red-500">*</span>
          </Label>
          <Input
            ref={titleInputRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError("");
            }}
            placeholder="e.g. How well do you know me? 💘"
            className={cn(
              titleError && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {titleError && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">
              {titleError}
            </p>
          )}
        </div>

        {/* Drag-and-drop question list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4 mb-6">
              {questions.map((q, i) => (
                <SortableQuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  onUpdate={(updated) => updateQuestion(q.id, updated)}
                  onDelete={() => deleteQuestion(q.id)}
                />
              ))}
            </div>
          </SortableContext>

          {/* Drag overlay — follows the cursor, shows a "lifted" card */}
          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeQuestion && (
              <QuestionCardInner
                question={activeQuestion}
                index={questions.findIndex((q) => q.id === activeQuestion.id)}
                onUpdate={() => {}}
                onDelete={() => {}}
                isDragging={true}
              />
            )}
          </DragOverlay>
        </DndContext>

        {/* Add question */}
        <button
          onClick={addQuestion}
          className="w-full py-3.5 rounded-xl border-2 border-dashed border-rose-300 text-rose-500 hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add Question
        </button>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-rose-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageCircleQuestion size={15} className="text-rose-500" />
            <span className="text-sm text-rose-500">
              <span className="text-rose-800 font-semibold">
                {completedCount}
              </span>
              /{questions.length} ready
            </span>
            {completedCount === questions.length && questions.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Sparkles size={12} /> All set!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600 hover:text-rose-800 hover:bg-rose-50 bg-transparent"
            >
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={
                isPublishing ||
                questions.length === 0 ||
                completedCount < questions.length
              }
              className="bg-pink-600 hover:bg-pink-500 text-white font-semibold px-5 shadow-lg shadow-pink-900/40 disabled:opacity-40"
            >
              {isPublishing ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={13} />
                  Send to Partner
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
