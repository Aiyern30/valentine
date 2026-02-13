"use client";

import { useState } from "react";
import { CalendarHeart } from "lucide-react";
import { SetAnniversaryDialog } from "./set-anniversary-dialog";

export function AnniversarySetup() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-linear-to-r from-rose-400 to-pink-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col items-center text-center justify-center min-h-50">
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2">
            <CalendarHeart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">When did your story begin?</h2>
          <p className="text-rose-100 max-w-md mx-auto">
            Set your anniversary date to start tracking your time together and
            unlock all features.
          </p>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-white text-rose-500 hover:bg-rose-50 px-6 py-2.5 rounded-full font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            Set Anniversary Date
          </button>
        </div>
      </div>

      <SetAnniversaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
