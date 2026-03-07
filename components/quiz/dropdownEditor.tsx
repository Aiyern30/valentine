"use client";

import { ChoiceOption } from "@/types/quiz";
import { Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./sharedUI";

const KEYS = ["A", "B", "C", "D", "E", "F"];

interface DropdownEditorProps {
  options: ChoiceOption[];
  correctOption: string;
  onChange: (opts: ChoiceOption[], newCorrect?: string) => void;
  onCorrectChange: (key: string) => void;
}

export function DropdownEditor({
  options,
  correctOption,
  onChange,
  onCorrectChange,
}: DropdownEditorProps) {
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

    if (!correctOption) {
      onChange(normalized);
      return;
    }
    if (correctOption === removedKey) {
      onChange(normalized, normalized[0]?.key ?? "");
      return;
    }

    onChange(normalized, keyMap.get(correctOption) ?? normalized[0]?.key ?? "");
  };

  return (
    <div>
      <SectionLabel>Dropdown options</SectionLabel>
      <div className="space-y-2 mb-3">
        {options.map((opt, idx) => (
          <div key={`${opt.key}-${idx}`} className="flex flex-col w-full">
            <div className="flex items-center gap-2">
              <span className="w-6 text-center text-xs text-rose-500 font-mono shrink-0">
                {idx + 1}
              </span>
              <input
                value={opt.label}
                onChange={(e) => updateLabel(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className={cn(
                  "flex-1 bg-white border rounded-lg px-3 py-1.5 text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none",
                  !opt.label.trim()
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                    : "border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20",
                )}
              />
              <button
                onClick={() => removeOption(idx)}
                disabled={options.length <= 2}
                className="text-rose-400 hover:text-red-500 disabled:opacity-20 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
            {!opt.label.trim() && (
              <p className="text-red-500 text-[10px] font-medium mt-1 ml-8">
                * Option text cannot be empty
              </p>
            )}
          </div>
        ))}
      </div>

      {options.length < 6 && (
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-pink-500 transition-colors mb-4"
        >
          <Plus size={12} /> Add option
        </button>
      )}

      {/* Preview + correct answer selector */}
      <SectionLabel>Your Answer (select from preview)</SectionLabel>
      <div className="relative">
        <select
          value={correctOption}
          onChange={(e) => onCorrectChange(e.target.value)}
          className="w-full appearance-none bg-white border border-rose-200 rounded-lg px-3 py-2 text-sm text-rose-900 focus:outline-none focus:border-pink-400 pr-8"
        >
          {options.map((opt) => (
            <option
              key={`${opt.key}-${opt.label}`}
              value={opt.key}
              className="bg-white text-rose-900"
            >
              {opt.label || `Option ${opt.key}`}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none"
        />
      </div>
    </div>
  );
}
