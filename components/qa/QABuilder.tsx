"use client";

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
import { useRouter } from "next/navigation";
import { submitQASession, updateQASession } from "@/lib/qa-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type QACategory = "memory" | "future" | "values" | "fun" | "deep" | "";

interface QAQuestion {
  id: string;
  question_text: string;
  category: QACategory;
  display_order: number;
}

const CATEGORIES: {
  value: QACategory;
  label: string;
  color: string;
  emoji: string;
}[] = [
  {
    value: "",
    label: "No tag",
    color: "border-gray-200 text-gray-500",
    emoji: "—",
  },
  {
    value: "memory",
    label: "Memory",
    color: "border-amber-200 text-amber-600 bg-amber-50",
    emoji: "🌸",
  },
  {
    value: "future",
    label: "Future",
    color: "border-violet-200 text-violet-600 bg-violet-50",
    emoji: "✨",
  },
  {
    value: "values",
    label: "Values",
    color: "border-sky-200 text-sky-600 bg-sky-50",
    emoji: "💡",
  },
  {
    value: "fun",
    label: "Fun",
    color: "border-emerald-200 text-emerald-600 bg-emerald-50",
    emoji: "🎉",
  },
  {
    value: "deep",
    label: "Deep",
    color: "border-rose-200 text-rose-600 bg-rose-50",
    emoji: "💭",
  },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeQuestion(order: number): QAQuestion {
  return { id: genId(), question_text: "", category: "", display_order: order };
}

function CategoryPicker({
  value,
  onChange,
}: {
  value: QACategory;
  onChange: (v: QACategory) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-2">
      <Tag size={11} className="text-gray-400 shrink-0" />
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] border transition-all duration-150 font-medium",
            value === cat.value
              ? cat.color
              : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600 bg-white",
          )}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}

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
        "border transition-all duration-200 group overflow-hidden",
        isDragging
          ? "bg-white border-rose-400 shadow-2xl scale-[1.02] opacity-95 z-50"
          : "bg-white/80 border-gray-100 shadow-sm hover:border-rose-200 hover:shadow-md",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
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
                  ? "text-rose-500"
                  : "text-gray-300 group-hover:text-gray-400",
              )}
            />
            <span className="text-[10px] font-bold text-gray-400 w-5 text-center">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                Heartfelt question
              </span>
              <button
                onClick={onDelete}
                className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <textarea
              value={question.question_text}
              onChange={(e) =>
                onUpdate({ ...question, question_text: e.target.value })
              }
              placeholder="e.g. What's your favourite memory of us? 🌸"
              rows={2}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 resize-none leading-relaxed transition-all"
            />

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

export function QABuilder({
  initialData,
  sessionId,
}: {
  initialData?: any;
  sessionId?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [questions, setQuestions] = useState<QAQuestion[]>(
    initialData?.questions?.map((q: any, i: number) => ({
      id: q.id || genId(),
      question_text: q.question_text,
      category: q.category || "",
      display_order: i,
    })) || [makeQuestion(0)],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (!e.over || e.active.id === e.over.id) return;
    setQuestions((prev) => {
      const from = prev.findIndex((q) => q.id === e.active.id);
      const to = prev.findIndex((q) => q.id === e.over!.id);
      return arrayMove(prev, from, to).map((q, i) => ({
        ...q,
        display_order: i,
      }));
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Please enter a title for your Q&A");
      return;
    }
    const readyQuestions = questions.filter((q) => q.question_text.trim());
    if (readyQuestions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    setIsSubmitting(true);
    const payload = readyQuestions.map((q) => ({
      question_text: q.question_text,
      category: q.category,
    }));

    const result = sessionId
      ? await updateQASession(sessionId, title, payload, status)
      : await submitQASession(title, payload, status);

    if (result.success) {
      toast.success(
        status === "published"
          ? "Q&A published to your partner! 💌"
          : "Draft saved!",
      );
      router.push("/qa_questions");
      router.refresh();
    } else {
      toast.error(result.error || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">
            Q&A Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 50 Deep Questions for Us"
            className="h-12 text-lg font-bold border-rose-100 focus:ring-rose-500/10 placeholder:text-gray-200"
          />
        </div>
      </div>

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
          <div className="space-y-4">
            {questions.map((q, i) => (
              <SortableQACard
                key={q.id}
                question={q}
                index={i}
                onUpdate={(u) =>
                  setQuestions((prev) =>
                    prev.map((old) => (old.id === q.id ? u : old)),
                  )
                }
                onDelete={() =>
                  setQuestions((prev) =>
                    prev.length > 1
                      ? prev.filter((old) => old.id !== q.id)
                      : prev,
                  )
                }
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
          {activeId && questions.find((q) => q.id === activeId) && (
            <QACardInner
              question={questions.find((q) => q.id === activeId)!}
              index={questions.findIndex((q) => q.id === activeId)}
              onUpdate={() => {}}
              onDelete={() => {}}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>

      <button
        onClick={() =>
          setQuestions((prev) => [...prev, makeQuestion(prev.length)])
        }
        className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-bold"
      >
        <Plus size={18} /> Add Heartfelt Question
      </button>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-rose-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2 text-rose-400 font-medium text-sm">
            <Sparkles size={16} />
            <span>
              {questions.filter((q) => q.question_text.trim()).length} questions
              ready
            </span>
          </div>
          <div className="flex gap-3 flex-1 md:flex-none">
            <Button
              variant="outline"
              className="flex-1 md:w-32 border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() => handleSave("draft")}
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            <Button
              className="flex-1 md:w-48 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-200"
              onClick={() => handleSave("published")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Send to Partner 💌"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
