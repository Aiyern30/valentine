/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Calendar,
  GripVertical,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  ChevronLeft,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createSharedGoal } from "@/lib/goal-actions";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/SectionHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

type GoalCategory = "health" | "finance" | "travel" | "lifestyle" | "learning";
type GoalType = "habit" | "one_time" | "milestone";
type GoalFrequency = "daily" | "weekly" | "monthly" | "";

interface SharedGoalInput {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  goal_type: GoalType;
  target_value: string;
  unit: string;
  frequency: GoalFrequency;
  start_date: string;
  end_date: string;
  display_order: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: {
  value: GoalCategory;
  label: string;
  emoji: string;
  color: string;
}[] = [
  {
    value: "health",
    label: "Health",
    emoji: "💪",
    color: "border-rose-200 text-rose-600 bg-rose-50",
  },
  {
    value: "finance",
    label: "Finance",
    emoji: "💰",
    color: "border-amber-200 text-amber-600 bg-amber-50",
  },
  {
    value: "travel",
    label: "Travel",
    emoji: "✈️",
    color: "border-sky-200 text-sky-600 bg-sky-50",
  },
  {
    value: "lifestyle",
    label: "Lifestyle",
    emoji: "🌿",
    color: "border-emerald-200 text-emerald-600 bg-emerald-50",
  },
  {
    value: "learning",
    label: "Learning",
    emoji: "📚",
    color: "border-violet-200 text-violet-600 bg-violet-50",
  },
];

const GOAL_TYPES: { value: GoalType; label: string; desc: string }[] = [
  { value: "habit", label: "Habit", desc: "Routine" },
  { value: "one_time", label: "One-time", desc: "Single" },
  { value: "milestone", label: "Milestone", desc: "Target" },
];

const FREQUENCIES: { value: GoalFrequency; label: string }[] = [
  { value: "", label: "Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeGoal(order: number): SharedGoalInput {
  const today = new Date().toISOString().split("T")[0];
  return {
    id: genId(),
    title: "",
    description: "",
    category: "lifestyle",
    goal_type: "habit",
    target_value: "",
    unit: "",
    frequency: "weekly",
    start_date: today,
    end_date: "",
    display_order: order,
  };
}

// ─── Card Inner ───────────────────────────────────────────────────────────────

function GoalCardInner({
  goal,
  index,
  onUpdate,
  onDelete,
  isDragging = false,
  dragHandleProps,
}: {
  goal: SharedGoalInput;
  index: number;
  onUpdate: (g: SharedGoalInput) => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const activeCat = CATEGORIES.find((c) => c.value === goal.category)!;
  const showTarget = goal.goal_type === "milestone";
  const showFreq = goal.goal_type === "habit";

  return (
    <Card
      className={cn(
        "border transition-all duration-300 group rounded-2xl overflow-hidden",
        isDragging
          ? "bg-white border-rose-300 shadow-2xl scale-[1.02] z-50"
          : "bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl shadow-rose-200/20 hover:border-rose-200",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Handle */}
          <div
            {...dragHandleProps}
            className={cn(
              "flex flex-col items-center gap-2 pt-1 shrink-0 select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab",
            )}
          >
            <GripVertical
              size={20}
              className={cn(
                "transition-colors",
                isDragging
                  ? "text-rose-500"
                  : "text-rose-100 group-hover:text-rose-300",
              )}
            />
            <span className="text-xs font-bold text-rose-300 w-6 h-6 rounded-full border border-rose-50 flex items-center justify-center">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            {/* Title + delete */}
            <div className="flex items-start gap-3">
              <input
                value={goal.title}
                onChange={(e) => onUpdate({ ...goal, title: e.target.value })}
                placeholder="What's your dream together? 🏔️"
                className="flex-1 bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-2.5 text-base text-gray-800 placeholder:text-rose-200 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 font-semibold transition-all"
              />
              <button
                onClick={onDelete}
                className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg mt-0.5"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {!isDragging && (
              <>
                {/* Description */}
                <textarea
                  value={goal.description}
                  onChange={(e) =>
                    onUpdate({ ...goal, description: e.target.value })
                  }
                  placeholder="Tell the story of why this matters… ✨"
                  rows={2}
                  className="w-full bg-rose-50/20 border border-rose-50 rounded-xl px-4 py-2 text-sm text-gray-600 placeholder:text-rose-200 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 resize-none leading-relaxed transition-all"
                />

                {/* Grid for settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-rose-400 font-bold px-1">
                      Theme
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() =>
                            onUpdate({ ...goal, category: cat.value })
                          }
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs border transition-all flex items-center gap-1.5",
                            goal.category === cat.value
                              ? cat.color + " shadow-sm font-bold scale-105"
                              : "bg-white border-gray-100 text-gray-400 hover:border-rose-200 hover:text-rose-400",
                          )}
                        >
                          <span>{cat.emoji}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal type */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-rose-400 font-bold px-1">
                      Goal Type
                    </label>
                    <div className="flex gap-2">
                      {GOAL_TYPES.map((gt) => (
                        <button
                          key={gt.value}
                          onClick={() =>
                            onUpdate({ ...goal, goal_type: gt.value })
                          }
                          className={cn(
                            "flex-1 py-1.5 rounded-full text-xs border transition-all",
                            goal.goal_type === gt.value
                              ? "bg-rose-600 border-rose-600 text-white font-bold shadow-md shadow-rose-200"
                              : "bg-white border-gray-100 text-gray-400 hover:border-rose-200",
                          )}
                        >
                          {gt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-rose-50">
                  {/* Target value (milestone/habit) */}
                  {(showTarget || showFreq) && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-rose-400 font-bold px-1">
                        {showTarget ? "Target Aim" : "Frequency"}
                      </label>
                      <div className="flex gap-2 items-center">
                        {showTarget ? (
                          <>
                            <input
                              type="number"
                              value={goal.target_value}
                              onChange={(e) =>
                                onUpdate({
                                  ...goal,
                                  target_value: e.target.value,
                                })
                              }
                              placeholder="100"
                              className="w-20 bg-rose-50/30 border border-rose-100 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-rose-300"
                            />
                            <input
                              value={goal.unit}
                              onChange={(e) =>
                                onUpdate({ ...goal, unit: e.target.value })
                              }
                              placeholder="unit (e.g. km)"
                              className="flex-1 bg-rose-50/30 border border-rose-100 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-rose-300"
                            />
                          </>
                        ) : (
                          <div className="flex gap-1.5 flex-1">
                            {FREQUENCIES.map((f) => (
                              <button
                                key={f.value}
                                onClick={() =>
                                  onUpdate({ ...goal, frequency: f.value })
                                }
                                className={cn(
                                  "flex-1 py-1.5 rounded-xl text-[10px] border transition-all",
                                  goal.frequency === f.value
                                    ? "bg-amber-100 border-amber-200 text-amber-600 font-bold shadow-sm"
                                    : "bg-white border-gray-100 text-gray-400",
                                )}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-rose-400 font-bold px-1">
                      Timeframe
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={goal.start_date}
                        onChange={(e) =>
                          onUpdate({ ...goal, start_date: e.target.value })
                        }
                        className="flex-1 bg-rose-50/30 border border-rose-100 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-rose-300 appearance-none"
                      />
                      <span className="text-gray-300 font-light">→</span>
                      <input
                        type="date"
                        value={goal.end_date}
                        onChange={(e) =>
                          onUpdate({ ...goal, end_date: e.target.value })
                        }
                        className="flex-1 bg-rose-50/30 border border-rose-100 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-rose-300 appearance-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableGoalCard({
  goal,
  index,
  onUpdate,
  onDelete,
}: {
  goal: SharedGoalInput;
  index: number;
  onUpdate: (g: SharedGoalInput) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
    >
      <GoalCardInner
        goal={goal}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewGoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<SharedGoalInput[]>([makeGoal(0)]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeGoal = goals.find((g) => g.id === activeId) ?? null;

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (!e.over || e.active.id === e.over.id) return;
    setGoals((prev) => {
      const from = prev.findIndex((g) => g.id === e.active.id);
      const to = prev.findIndex((g) => g.id === e.over!.id);
      const next = arrayMove(prev, from, to).map((g, i) => ({
        ...g,
        display_order: i,
      }));
      return next;
    });
  };

  const addGoal = () => setGoals((prev) => [...prev, makeGoal(prev.length)]);
  const updateGoal = (id: string, updated: SharedGoalInput) =>
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  const deleteGoal = (id: string) => {
    if (goals.length === 1) return;
    setGoals((prev) =>
      prev
        .filter((g) => g.id !== id)
        .map((g, i) => ({ ...g, display_order: i })),
    );
  };

  const handleSave = async () => {
    const validGoals = goals.filter((g) => g.title.trim());
    if (validGoals.length === 0) {
      toast.error("Please add at least one goal with a title! 🌸");
      return;
    }

    setIsSaving(true);
    try {
      let allSuccess = true;
      for (const g of validGoals) {
        const result = await createSharedGoal({
          title: g.title,
          description: g.description || null,
          category: g.category,
          goal_type: g.goal_type,
          target_value: g.target_value ? parseFloat(g.target_value) : null,
          unit: g.unit || null,
          frequency: g.frequency || null,
          start_date: g.start_date,
          end_date: g.end_date || null,
          display_order: g.display_order,
          status: "active",
        });
        if (!result.success) {
          allSuccess = false;
          toast.error(`Failed to save "${g.title}": ${result.error}`);
        }
      }

      if (allSuccess) {
        toast.success("Goals shared with your partner! 🌱✨");
        router.push("/shared_goals");
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const readyCount = goals.filter((g) => g.title.trim()).length;

  return (
    <div className="min-h-screen bg-rose-50/30 pb-32">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-rose-200/20 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-200/20 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-10">
        <SectionHeader
          icon={<Target className="w-6 h-6 text-white" />}
          title="Shared Goals"
          description="Create dreams and habits you'll work on together 🌱"
          button={
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600 rounded-xl"
            >
              <ChevronLeft size={16} className="mr-1" /> Back
            </Button>
          }
        />

        <div className="mt-12">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={goals.map((g) => g.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6 mb-8">
                {goals.map((g, i) => (
                  <SortableGoalCard
                    key={g.id}
                    goal={g}
                    index={i}
                    onUpdate={(updated) => updateGoal(g.id, updated)}
                    onDelete={() => deleteGoal(g.id)}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
              {activeGoal && (
                <GoalCardInner
                  goal={activeGoal}
                  index={goals.findIndex((g) => g.id === activeGoal.id)}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  isDragging
                />
              )}
            </DragOverlay>
          </DndContext>

          <button
            onClick={addGoal}
            className="w-full py-8 rounded-2xl border-2 border-dashed border-rose-100 text-rose-300 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-100/30 transition-all duration-300 flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-rose-400" />
            </div>
            <span className="text-sm font-bold tracking-wide">
              Add Another Shared Dream
            </span>
          </button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-rose-100 shadow-2xl rounded-3xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="relative w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center">
              <Target size={18} className="text-rose-500" />
              {readyCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {readyCount}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800">
                Growth Progress
              </span>
              <span className="text-[10px] text-gray-400">
                {readyCount} of {goals.length} goals ready
              </span>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving || readyCount === 0}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-40"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Planting Seeds...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={16} /> Share Goals ✨
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
