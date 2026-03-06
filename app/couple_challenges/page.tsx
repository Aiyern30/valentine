/* eslint-disable react/no-unescaped-entities */
"use client";

/**
 * Page: /challenges
 * Feature: 恋爱挑战 — Love Challenges
 * Table: couple_challenges
 *
 * Flow:
 *  - Either partner creates challenges for both to complete together
 *  - Each card = one couple_challenges row
 *  - Both partners mark their own side complete on a separate view
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
  Clock,
  Flame,
  GripVertical,
  Plus,
  Send,
  Sparkles,
  Swords,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChallengeCategory = "fun" | "romantic" | "growth" | "adventure";
type ChallengeDifficulty = "easy" | "medium" | "hard";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  duration_days: number;
  due_at: string; // ISO date string or ""
  display_order: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: {
  value: ChallengeCategory;
  label: string;
  emoji: string;
  color: string;
}[] = [
  {
    value: "fun",
    label: "Fun",
    emoji: "🎉",
    color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  },
  {
    value: "romantic",
    label: "Romantic",
    emoji: "💕",
    color: "border-pink-500/40 text-pink-400 bg-pink-500/10",
  },
  {
    value: "growth",
    label: "Growth",
    emoji: "🌱",
    color: "border-violet-500/40 text-violet-400 bg-violet-500/10",
  },
  {
    value: "adventure",
    label: "Adventure",
    emoji: "🗺️",
    color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  },
];

const DIFFICULTIES: {
  value: ChallengeDifficulty;
  label: string;
  color: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  },
  {
    value: "medium",
    label: "Medium",
    color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  },
  {
    value: "hard",
    label: "Hard",
    color: "text-red-400 border-red-500/40 bg-red-500/10",
  },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeChallenge(order: number): Challenge {
  return {
    id: genId(),
    title: "",
    description: "",
    category: "fun",
    difficulty: "easy",
    duration_days: 1,
    due_at: "",
    display_order: order,
  };
}

// ─── Card Inner ───────────────────────────────────────────────────────────────

function ChallengeCardInner({
  challenge,
  index,
  onUpdate,
  onDelete,
  isDragging = false,
  dragHandleProps,
}: {
  challenge: Challenge;
  index: number;
  onUpdate: (c: Challenge) => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const activeCat = CATEGORIES.find((c) => c.value === challenge.category)!;
  const activeDiff = DIFFICULTIES.find(
    (d) => d.value === challenge.difficulty,
  )!;

  return (
    <Card
      className={cn(
        "border transition-all duration-200 group",
        isDragging
          ? "bg-zinc-800 border-emerald-500/60 shadow-2xl shadow-emerald-900/30 scale-[1.02]"
          : "bg-zinc-900/80 border-zinc-800 shadow-lg shadow-black/20 hover:border-zinc-700",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          {/* Handle */}
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
                  ? "text-emerald-400"
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
                value={challenge.title}
                onChange={(e) =>
                  onUpdate({ ...challenge, title: e.target.value })
                }
                placeholder="Challenge title… e.g. Cook dinner together 🍳"
                className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 font-medium"
              />
              <button
                onClick={onDelete}
                className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 mt-2 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Description */}
            {!isDragging && (
              <textarea
                value={challenge.description}
                onChange={(e) =>
                  onUpdate({ ...challenge, description: e.target.value })
                }
                placeholder="Optional details — what counts as completing this? 📝"
                rows={2}
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-none leading-relaxed"
              />
            )}

            {!isDragging && (
              <div className="space-y-2.5">
                {/* Category */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 shrink-0">
                    Category
                  </span>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() =>
                        onUpdate({ ...challenge, category: cat.value })
                      }
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs border transition-all",
                        challenge.category === cat.value
                          ? cat.color
                          : "border-zinc-800 text-zinc-600 hover:border-zinc-600",
                      )}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Difficulty */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 shrink-0">
                    Difficulty
                  </span>
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() =>
                        onUpdate({ ...challenge, difficulty: diff.value })
                      }
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs border transition-all",
                        challenge.difficulty === diff.value
                          ? diff.color
                          : "border-zinc-800 text-zinc-600 hover:border-zinc-600",
                      )}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>

                {/* Duration + Due date */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-16 shrink-0">
                    Duration
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-zinc-600" />
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={challenge.duration_days}
                      onChange={(e) =>
                        onUpdate({
                          ...challenge,
                          duration_days: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-14 bg-zinc-800/60 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 text-center focus:outline-none focus:border-emerald-500/50"
                    />
                    <span className="text-xs text-zinc-500">
                      day{challenge.duration_days !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    <Calendar size={12} className="text-zinc-600" />
                    <input
                      type="date"
                      value={challenge.due_at}
                      onChange={(e) =>
                        onUpdate({ ...challenge, due_at: e.target.value })
                      }
                      className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50 scheme-dark"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableChallengeCard({
  challenge,
  index,
  onUpdate,
  onDelete,
}: {
  challenge: Challenge;
  index: number;
  onUpdate: (c: Challenge) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: challenge.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
    >
      <ChallengeCardInner
        challenge={challenge}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoupleChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([makeChallenge(0)]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeChallenge = challenges.find((c) => c.id === activeId) ?? null;

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (!e.over || e.active.id === e.over.id) return;
    setChallenges((prev) => {
      const from = prev.findIndex((c) => c.id === e.active.id);
      const to = prev.findIndex((c) => c.id === e.over!.id);
      const next = arrayMove(prev, from, to).map((c, i) => ({
        ...c,
        display_order: i,
      }));

      // TODO: persist
      // await supabase.rpc("reorder_rows", {
      //   p_table: "couple_challenges",
      //   p_scope_col: "relationship_id",
      //   p_scope_id: relationshipId,
      //   p_ordered_ids: next.map((c) => c.id),
      // });

      return next;
    });
  };

  const addChallenge = () =>
    setChallenges((prev) => [...prev, makeChallenge(prev.length)]);
  const updateChallenge = (id: string, updated: Challenge) =>
    setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
  const deleteChallenge = (id: string) => {
    if (challenges.length === 1) return;
    setChallenges((prev) =>
      prev
        .filter((c) => c.id !== id)
        .map((c, i) => ({ ...c, display_order: i })),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    const payload = challenges.map((c, i) => ({
      title: c.title,
      description: c.description || null,
      category: c.category,
      difficulty: c.difficulty,
      duration_days: c.duration_days,
      due_at: c.due_at || null,
      display_order: i,
      status: "active",
      // relationship_id: relationshipId,
      // created_by: user.id,
    }));

    console.log(
      "Inserting couple_challenges:",
      JSON.stringify(payload, null, 2),
    );

    // TODO: await supabase.from("couple_challenges").insert(payload);

    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  const readyCount = challenges.filter((c) => c.title.trim()).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-62.5 bg-emerald-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-32">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-emerald-400" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
              恋爱挑战
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-1">
            Love Challenges
          </h1>
          <p className="text-zinc-500 text-sm">
            Create challenges for you and your partner to do together 🔥
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
            items={challenges.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4 mb-6">
              {challenges.map((c, i) => (
                <SortableChallengeCard
                  key={c.id}
                  challenge={c}
                  index={i}
                  onUpdate={(updated) => updateChallenge(c.id, updated)}
                  onDelete={() => deleteChallenge(c.id)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeChallenge && (
              <ChallengeCardInner
                challenge={activeChallenge}
                index={challenges.findIndex((c) => c.id === activeChallenge.id)}
                onUpdate={() => {}}
                onDelete={() => {}}
                isDragging
              />
            )}
          </DragOverlay>
        </DndContext>

        <button
          onClick={addChallenge}
          className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} /> Add Challenge
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords size={15} className="text-zinc-500" />
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-200 font-semibold">{readyCount}</span>/
              {challenges.length} challenges ready
            </span>
            {readyCount === challenges.length && challenges.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Sparkles size={12} /> Let's go!
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || readyCount === 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 shadow-lg shadow-emerald-900/40 disabled:opacity-40"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={13} /> Save Challenges
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
