"use client";

/**
 * Page: /qa-questions
 * Feature: 情侣走心互答 — Heartfelt Q&A
 * Table: qa_questions + qa_answers
 *
 * Flow:
 *  - Partner A opens this page and writes questions for Partner B
 *  - Each card = one qa_questions row (created_by = me, relationship_id = shared)
 *  - Partner B will see these cards and submit answers via a separate answer page
 *
 * Install: npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
 */

import { useState } from "react";
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
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type QACategory = "memory" | "future" | "values" | "fun" | "deep" | "";

interface QAQuestion {
  id: string;
  question_text: string;
  category: QACategory;
  display_order: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: {
  value: QACategory;
  label: string;
  color: string;
  emoji: string;
}[] = [
  {
    value: "",
    label: "No tag",
    color: "border-zinc-700 text-zinc-500",
    emoji: "—",
  },
  {
    value: "memory",
    label: "Memory",
    color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    emoji: "🌸",
  },
  {
    value: "future",
    label: "Future",
    color: "border-violet-500/40 text-violet-400 bg-violet-500/10",
    emoji: "✨",
  },
  {
    value: "values",
    label: "Values",
    color: "border-sky-500/40 text-sky-400 bg-sky-500/10",
    emoji: "💡",
  },
  {
    value: "fun",
    label: "Fun",
    color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    emoji: "🎉",
  },
  {
    value: "deep",
    label: "Deep",
    color: "border-rose-500/40 text-rose-400 bg-rose-500/10",
    emoji: "💭",
  },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeQuestion(order: number): QAQuestion {
  return { id: genId(), question_text: "", category: "", display_order: order };
}

// ─── Category Picker ──────────────────────────────────────────────────────────

function CategoryPicker({
  value,
  onChange,
}: {
  value: QACategory;
  onChange: (v: QACategory) => void;
}) {
  const active = CATEGORIES.find((c) => c.value === value)!;

  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-2">
      <Tag size={11} className="text-zinc-600 flex-shrink-0" />
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            "px-2 py-0.5 rounded-full text-xs border transition-all duration-150",
            value === cat.value
              ? cat.color
              : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400",
          )}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}

// ─── Card inner ───────────────────────────────────────────────────────────────

function QACardInner({
  question,
  index,
  onUpdate,
  onDelete,
  isDragging = false,
  dragHandleProps,
}: {
  question: QAQuestion;
  index: number;
  onUpdate: (q: QAQuestion) => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <Card
      className={cn(
        "border transition-all duration-200 group",
        isDragging
          ? "bg-zinc-800 border-pink-500/60 shadow-2xl shadow-pink-900/30 scale-[1.02] opacity-95"
          : "bg-zinc-900/80 border-zinc-800 shadow-lg shadow-black/20 hover:border-zinc-700",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          {/* Handle */}
          <div
            {...dragHandleProps}
            className={cn(
              "flex flex-col items-center gap-1.5 pt-1 flex-shrink-0 select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab",
            )}
          >
            <GripVertical
              size={16}
              className={cn(
                "transition-colors",
                isDragging
                  ? "text-pink-400"
                  : "text-zinc-700 group-hover:text-zinc-400",
              )}
            />
            <span className="text-xs font-bold text-zinc-600 w-5 text-center">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Top row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-600 font-medium">
                Question for your partner
              </span>
              <button
                onClick={onDelete}
                className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Question input */}
            <textarea
              value={question.question_text}
              onChange={(e) =>
                onUpdate({ ...question, question_text: e.target.value })
              }
              placeholder="e.g. What's your favourite memory of us? 🌸"
              rows={2}
              className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 resize-none leading-relaxed"
            />

            {/* Category picker */}
            {!isDragging && (
              <CategoryPicker
                value={question.category}
                onChange={(cat) => onUpdate({ ...question, category: cat })}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableQACard({
  question,
  index,
  onUpdate,
  onDelete,
}: {
  question: QAQuestion;
  index: number;
  onUpdate: (q: QAQuestion) => void;
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

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
    >
      <QACardInner
        question={question}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QAQuestionsPage() {
  const [questions, setQuestions] = useState<QAQuestion[]>([makeQuestion(0)]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeQuestion = questions.find((q) => q.id === activeId) ?? null;

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (!e.over || e.active.id === e.over.id) return;
    setQuestions((prev) => {
      const from = prev.findIndex((q) => q.id === e.active.id);
      const to = prev.findIndex((q) => q.id === e.over!.id);
      const next = arrayMove(prev, from, to).map((q, i) => ({
        ...q,
        display_order: i,
      }));

      // TODO: persist reorder
      // await supabase.rpc("reorder_rows", {
      //   p_table: "qa_questions",
      //   p_scope_col: "relationship_id",
      //   p_scope_id: relationshipId,
      //   p_ordered_ids: next.map((q) => q.id),
      // });

      return next;
    });
  };

  const addQuestion = () =>
    setQuestions((prev) => [...prev, makeQuestion(prev.length)]);

  const updateQuestion = (id: string, updated: QAQuestion) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));

  const deleteQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, display_order: i })),
    );
  };

  const handleSend = async () => {
    setIsSending(true);

    const payload = questions.map((q, i) => ({
      question_text: q.question_text,
      category: q.category || null,
      display_order: i,
      // relationship_id: relationshipId,   ← inject from context
      // created_by: user.id,               ← inject from auth
    }));

    console.log("Inserting qa_questions:", JSON.stringify(payload, null, 2));

    // TODO: Supabase insert
    // await supabase.from("qa_questions").insert(payload);

    await new Promise((r) => setTimeout(r, 1000));
    setIsSending(false);
  };

  const readyCount = questions.filter((q) => q.question_text.trim()).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-rose-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-32">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} className="text-rose-400" fill="currentColor" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
              情侣走心互答
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-1">
            Ask Your Partner
          </h1>
          <p className="text-zinc-500 text-sm">
            Write heartfelt questions — your partner will answer them one by one
            💌
          </p>
        </div>

        {/* Cards */}
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
                <SortableQACard
                  key={q.id}
                  question={q}
                  index={i}
                  onUpdate={(updated) => updateQuestion(q.id, updated)}
                  onDelete={() => deleteQuestion(q.id)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeQuestion && (
              <QACardInner
                question={activeQuestion}
                index={questions.findIndex((q) => q.id === activeQuestion.id)}
                onUpdate={() => {}}
                onDelete={() => {}}
                isDragging
              />
            )}
          </DragOverlay>
        </DndContext>

        <button
          onClick={addQuestion}
          className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:border-rose-500/50 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} /> Add Question
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={15} className="text-zinc-500" />
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-200 font-semibold">{readyCount}</span>/
              {questions.length} questions written
            </span>
            {readyCount === questions.length && questions.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Sparkles size={12} /> Ready!
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={isSending || readyCount === 0}
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-5 shadow-lg shadow-rose-900/40 disabled:opacity-40"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={13} /> Send to Partner
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
