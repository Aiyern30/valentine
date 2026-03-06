"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChoiceOption } from "@/types/quiz";
import { SectionLabel } from "./sharedUI";

const KEYS = ["A", "B", "C", "D", "E", "F"];

interface CheckboxesEditorProps {
  options: ChoiceOption[];
  correctOption: string; // comma-separated keys e.g. "A,C"
  onChange: (opts: ChoiceOption[]) => void;
  onCorrectChange: (val: string) => void;
}

export function CheckboxesEditor({
  options,
  correctOption,
  onChange,
  onCorrectChange,
}: CheckboxesEditorProps) {
  const selected = correctOption ? correctOption.split(",") : [];

  const toggleSelected = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    onCorrectChange(next.join(","));
  };

  const updateLabel = (idx: number, label: string) =>
    onChange(options.map((o, i) => (i === idx ? { ...o, label } : o)));

  const addOption = () => {
    if (options.length >= 6) return;
    onChange([...options, { key: KEYS[options.length], label: "" }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const removedKey = options[idx].key;
    onChange(options.filter((_, i) => i !== idx));
    onCorrectChange(selected.filter((k) => k !== removedKey).join(","));
  };

  return (
    <div>
      <SectionLabel>Options — tick all that apply (your answers)</SectionLabel>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={opt.key} className="flex items-center gap-2">
            {/* Checkbox toggle */}
            <button
              onClick={() => toggleSelected(opt.key)}
              className={cn(
                "w-7 h-7 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200 text-xs font-bold",
                selected.includes(opt.key)
                  ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30"
                  : "border-zinc-600 text-zinc-500 hover:border-zinc-400",
              )}
            >
              {selected.includes(opt.key) ? "✓" : opt.key}
            </button>

            <input
              value={opt.label}
              onChange={(e) => updateLabel(idx, e.target.value)}
              placeholder={`Option ${opt.key}`}
              className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20"
            />

            <button
              onClick={() => removeOption(idx)}
              disabled={options.length <= 2}
              className="text-zinc-600 hover:text-red-400 disabled:opacity-20 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {options.length < 6 && (
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-pink-400 transition-colors mt-2"
        >
          <Plus size={12} /> Add option
        </button>
      )}
      <p className="text-xs text-zinc-600 mt-2">
        Checked boxes = your correct answers. Partner must match all of them.
      </p>
    </div>
  );
}
