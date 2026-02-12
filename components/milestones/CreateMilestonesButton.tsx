"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateEventDialog } from "../dashboard/create-event-dialog";

export function CreateMilestoneButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Add Milestone
      </button>

      <CreateEventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
