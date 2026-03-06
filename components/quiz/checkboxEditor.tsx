"use client";

import { useEffect, useMemo } from "react";
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
  const selected = useMemo(
    () => (correctOption ? correctOption.split(",") : []),
    [correctOption],
  );
  useEffect(() => {
    const isSequential = options.every((opt, idx) => opt.key === KEYS[idx]);
    if (isSequential) return;

    const keyMap = new Map<string, string>();
    const normalized = options.map((opt, idx) => {
      const newKey = KEYS[idx];
      keyMap.set(opt.key, newKey);
      return { ...opt, key: newKey };
    });

    onChange(normalized);

    if (selected.length > 0) {
      const remappedSelected = selected
        .map((k) => keyMap.get(k))
        .filter((k): k is string => Boolean(k));
      onCorrectChange(remappedSelected.join(","));
    }
  }, [options, selected, onChange, onCorrectChange]);

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
    const normalized = options.map((opt, idx) => ({ ...opt, key: KEYS[idx] }));
    onChange([...normalized, { key: KEYS[normalized.length], label: "" }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const removedKey = options[idx].key;
    const filtered = options.filter((_, i) => i !== idx);
    const keyMap = new Map<string, string>();
    const normalized = filtered.map((opt, i) => {
      const newKey = KEYS[i];
      keyMap.set(opt.key, newKey);
      return { ...opt, key: newKey };
    });

    onChange(normalized);

    const remappedSelected = selected
      .filter((k) => k !== removedKey)
      .map((k) => keyMap.get(k))
      .filter((k): k is string => Boolean(k));
    onCorrectChange(remappedSelected.join(","));
  };

  return (
    <div>
      <SectionLabel>Options — tick all that apply (your answers)</SectionLabel>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={`${opt.key}-${idx}`} className="flex items-center gap-2">
            {/* Checkbox toggle */}
            <button
              onClick={() => toggleSelected(opt.key)}
              className={cn(
                "w-7 h-7 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200 text-xs font-bold",
                selected.includes(opt.key)
                  ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30"
                  : "border-rose-300 text-rose-500 hover:border-rose-400",
              )}
            >
              {selected.includes(opt.key) ? "✓" : opt.key}
            </button>

            <input
              value={opt.label}
              onChange={(e) => updateLabel(idx, e.target.value)}
              placeholder={`Option ${opt.key}`}
              className="flex-1 bg-white border border-rose-200 rounded-lg px-3 py-1.5 text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20"
            />

            <button
              onClick={() => removeOption(idx)}
              disabled={options.length <= 2}
              className="text-rose-400 hover:text-red-500 disabled:opacity-20 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {options.length < 6 && (
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-pink-500 transition-colors mt-2"
        >
          <Plus size={12} /> Add option
        </button>
      )}
      <p className="text-xs text-rose-500 mt-2">
        Checked boxes = your correct answers. Partner must match all of them.
      </p>
    </div>
  );
}
