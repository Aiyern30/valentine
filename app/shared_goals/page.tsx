/* eslint-disable react/no-unescaped-entities */
"use client";

/**
 * Page: /shared-goals
 * Feature: 一起better — Grow Together
 * Table: shared_goals
 *
 * Flow:
 *  - Either partner creates shared goals for the couple
 *  - Each card = one shared_goals row
 *  - Both partners log check-ins via goal_checkins on a separate view
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
  Calendar,
  GripVertical,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type GoalCategory = "health" | "finance" | "travel" | "lifestyle" | "learning";
type GoalType = "habit" | "one_time" | "milestone";
type GoalFrequency = "daily" | "weekly" | "monthly" | "";

interface SharedGoal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  goal_type: GoalType;
  target_value: string; // string for input, convert to number on save
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
    color: "border-rose-500/40 text-rose-400 bg-rose-500/10",
  },
  {
    value: "finance",
    label: "Finance",
    emoji: "💰",
    color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  },
  {
    value: "travel",
    label: "Travel",
    emoji: "✈️",
    color: "border-sky-500/40 text-sky-400 bg-sky-500/10",
  },
  {
    value: "lifestyle",
    label: "Lifestyle",
    emoji: "🌿",
    color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  },
  {
    value: "learning",
    label: "Learning",
    emoji: "📚",
    color: "border-violet-500/40 text-violet-400 bg-violet-500/10",
  },
];

const GOAL_TYPES: { value: GoalType; label: string; desc: string }[] = [
  { value: "habit", label: "Habit", desc: "Recurring routine" },
  { value: "one_time", label: "One-time", desc: "Complete once" },
  { value: "milestone", label: "Milestone", desc: "Reach a target" },
];

const FREQUENCIES: { value: GoalFrequency; label: string }[] = [
  { value: "", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeGoal(order: number): SharedGoal {
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
  goal: SharedGoal;
  index: number;
  onUpdate: (g: SharedGoal) => void;
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
        "border transition-all duration-200 group",
        isDragging
          ? "bg-zinc-800 border-violet-500/60 shadow-2xl shadow-violet-900/30 scale-[1.02]"
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
                  ? "text-violet-400"
                  : "text-zinc-700 group-hover:text-zinc-400",
              )}
            />
            <span className="text-xs font-bold text-zinc-600 w-5 text-center">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Title + delete */}
            <div className="flex items-start gap-2">
              <input
                value={goal.title}
                onChange={(e) => onUpdate({ ...goal, title: e.target.value })}
                placeholder="Goal title… e.g. Run 5km every week 🏃"
                className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 font-medium"
              />
              <button
                onClick={onDelete}
                className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 mt-2 flex-shrink-0"
              >
                <Trash2 size={14} />
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
                  placeholder="Optional — why does this matter to you both? 💬"
                  rows={2}
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none leading-relaxed"
                />

                {/* Category */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 flex-shrink-0">
                    Category
                  </span>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => onUpdate({ ...goal, category: cat.value })}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs border transition-all",
                        goal.category === cat.value
                          ? cat.color
                          : "border-zinc-800 text-zinc-600 hover:border-zinc-600",
                      )}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Goal type */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 flex-shrink-0">
                    Type
                  </span>
                  {GOAL_TYPES.map((gt) => (
                    <button
                      key={gt.value}
                      onClick={() => onUpdate({ ...goal, goal_type: gt.value })}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs border transition-all",
                        goal.goal_type === gt.value
                          ? "border-violet-500/40 text-violet-400 bg-violet-500/10"
                          : "border-zinc-800 text-zinc-600 hover:border-zinc-600",
                      )}
                    >
                      {gt.label}
                      <span className="ml-1 text-zinc-600 text-[10px]">
                        {gt.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Target value (milestone only) */}
                {showTarget && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 flex-shrink-0">
                      Target
                    </span>
                    <input
                      type="number"
                      value={goal.target_value}
                      onChange={(e) =>
                        onUpdate({ ...goal, target_value: e.target.value })
                      }
                      placeholder="100"
                      className="w-20 bg-zinc-800/60 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 text-center focus:outline-none focus:border-violet-500/50"
                    />
                    <input
                      value={goal.unit}
                      onChange={(e) =>
                        onUpdate({ ...goal, unit: e.target.value })
                      }
                      placeholder="unit (e.g. km)"
                      className="w-28 bg-zinc-800/60 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                )}

                {/* Frequency (habit only) */}
                {showFreq && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 flex-shrink-0">
                      Repeat
                    </span>
                    <RefreshCw size={11} className="text-zinc-600" />
                    {FREQUENCIES.map((f) => (
                      <button
                        key={f.value}
                        onClick={() =>
                          onUpdate({ ...goal, frequency: f.value })
                        }
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs border transition-all",
                          goal.frequency === f.value
                            ? "border-violet-500/40 text-violet-400 bg-violet-500/10"
                            : "border-zinc-800 text-zinc-600 hover:border-zinc-600",
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Dates */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 flex-shrink-0">
                    Dates
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-zinc-600" />
                    <span className="text-[10px] text-zinc-600">Start</span>
                    <input
                      type="date"
                      value={goal.start_date}
                      onChange={(e) =>
                        onUpdate({ ...goal, start_date: e.target.value })
                      }
                      className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-violet-500/50 [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-600">End</span>
                    <input
                      type="date"
                      value={goal.end_date}
                      onChange={(e) =>
                        onUpdate({ ...goal, end_date: e.target.value })
                      }
                      className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-violet-500/50 [color-scheme:dark]"
                    />
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
  goal: SharedGoal;
  index: number;
  onUpdate: (g: SharedGoal) => void;
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

export default function SharedGoalsPage() {
  const [goals, setGoals] = useState<SharedGoal[]>([makeGoal(0)]);
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

      // TODO: persist
      // await supabase.rpc("reorder_rows", {
      //   p_table: "shared_goals",
      //   p_scope_col: "relationship_id",
      //   p_scope_id: relationshipId,
      //   p_ordered_ids: next.map((g) => g.id),
      // });

      return next;
    });
  };

  const addGoal = () => setGoals((prev) => [...prev, makeGoal(prev.length)]);
  const updateGoal = (id: string, updated: SharedGoal) =>
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
    setIsSaving(true);

    const payload = goals.map((g, i) => ({
      title: g.title,
      description: g.description || null,
      category: g.category,
      goal_type: g.goal_type,
      target_value: g.target_value ? parseFloat(g.target_value) : null,
      unit: g.unit || null,
      frequency: g.frequency || null,
      start_date: g.start_date,
      end_date: g.end_date || null,
      display_order: i,
      status: "active",
      // relationship_id: relationshipId,
      // created_by: user.id,
    }));

    console.log("Inserting shared_goals:", JSON.stringify(payload, null, 2));

    // TODO: await supabase.from("shared_goals").insert(payload);

    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  const readyCount = goals.filter((g) => g.title.trim()).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-32">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-violet-400" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
              一起better
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-1">
            Grow Together
          </h1>
          <p className="text-zinc-500 text-sm">
            Set goals you'll both work on — track progress together 🌱
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
            items={goals.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4 mb-6">
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
          className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/5 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={15} className="text-zinc-500" />
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-200 font-semibold">{readyCount}</span>/
              {goals.length} goals set
            </span>
            {readyCount === goals.length && goals.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Sparkles size={12} /> Ready to grow!
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || readyCount === 0}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 shadow-lg shadow-violet-900/40 disabled:opacity-40"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={13} /> Save Goals
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
