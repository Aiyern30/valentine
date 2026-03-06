"use client";

import { SectionLabel } from "./sharedUI";

interface TimeEditorProps {
  correctOption: string;
  onCorrectChange: (val: string) => void;
}

export function TimeEditor({
  correctOption,
  onCorrectChange,
}: TimeEditorProps) {
  return (
    <div>
      <SectionLabel>Your Answer</SectionLabel>
      <input
        type="time"
        value={correctOption}
        onChange={(e) => onCorrectChange(e.target.value)}
        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 scheme-dark"
      />
      <p className="text-xs text-zinc-600 mt-1.5">
        Your partner picks a time — it will be compared to yours.
      </p>
    </div>
  );
}
