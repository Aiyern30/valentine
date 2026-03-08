"use client";

import { useState, useEffect } from "react";
import {
  Challenge,
  getChallenges,
  updateChallenge,
} from "@/lib/couple-challenge-actions";
import { ChallengeCard } from "./ChallengeCard";
import { ChallengeDialog } from "./ChallengeDialog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Flame,
  Heart,
  Sparkles,
  Swords,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

function SortableChallengeCard({
  challenge,
  userId,
  isPartner1,
  onEdit,
}: {
  challenge: Challenge;
  userId: string;
  isPartner1: boolean;
  onEdit: (c: Challenge) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: challenge.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 text-rose-200 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={20} />
      </div>
      <ChallengeCard
        challenge={challenge}
        userId={userId}
        isPartner1={isPartner1}
        onEdit={onEdit}
      />
    </div>
  );
}

export function ChallengeDashboard({
  initialChallenges,
  userId,
  isPartner1,
}: {
  initialChallenges: Challenge[];
  userId: string;
  isPartner1: boolean;
}) {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<
    Challenge | undefined
  >();

  useEffect(() => {
    setChallenges(initialChallenges);
  }, [initialChallenges]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChallenges((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Persist the new order
        persistOrder(newItems);

        return newItems;
      });
    }
  };

  const persistOrder = async (newItems: Challenge[]) => {
    // Update display_order for all affected items
    // In a real app, you might want a specialized "updateOrder" action
    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].display_order !== i) {
        await updateChallenge(newItems[i].id, { display_order: i });
      }
    }
  };

  const handleCreate = () => {
    setEditingChallenge(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setDialogOpen(true);
  };

  const activeChallenges = challenges.filter((c) => c.status !== "completed");
  const completedChallenges = challenges.filter(
    (c) => c.status === "completed",
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SectionHeader
        icon={<Flame className="w-6 h-6 text-white" />}
        title="Couple Challenges"
        description="Ignite the flame with shared tasks and adventures! 🔥"
        button={
          <Button
            onClick={handleCreate}
            className="bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20 w-full md:w-auto rounded-2xl h-11"
          >
            <Plus size={18} className="mr-2" />
            New Challenge
          </Button>
        }
      />

      {challenges.length === 0 ? (
        <div className="text-center py-20 px-4 border-2 border-dashed border-rose-200 rounded-[32px] bg-white/50 backdrop-blur-sm shadow-xl">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Flame size={32} className="text-pink-500 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-rose-900 mb-2">
            No challenges yet!
          </h3>
          <p className="text-rose-500 max-w-sm mx-auto mb-8 text-lg">
            Ready to spice things up? Create your first challenge and start a
            new journey together.
          </p>
          <Button
            onClick={handleCreate}
            variant="outline"
            className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-pink-300 h-12 px-8 font-bold"
          >
            Create first challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2.5 bg-pink-100 rounded-2xl shadow-sm border border-pink-200">
                  <Flame size={20} className="text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-rose-900 tracking-tight">
                    Active Flames
                  </h2>
                  <p className="text-rose-400 text-sm font-medium">
                    Drag to reorder your priorities
                  </p>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={activeChallenges.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeChallenges.map((challenge) => (
                      <SortableChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        userId={userId}
                        isPartner1={isPartner1}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2.5 bg-emerald-100 rounded-2xl shadow-sm border border-emerald-200">
                  <Sparkles size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-rose-900 tracking-tight">
                    Cherished Memories
                  </h2>
                  <p className="text-rose-400 text-sm font-medium">
                    Successfully completed challenges
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
                {completedChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    userId={userId}
                    isPartner1={isPartner1}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ChallengeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        challenge={editingChallenge}
      />
    </div>
  );
}
