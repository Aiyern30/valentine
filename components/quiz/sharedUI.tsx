"use client";

import { cn } from "@/lib/utils";
import { QuestionType, QUESTION_TYPE_META } from "@/types/quiz";
import {
  AlignLeft,
  Calendar,
  CheckSquare,
  ChevronDown,
  Clock,
  List,
  MinusSquare,
  SlidersHorizontal,
  Star,
  Type,
} from "lucide-react";

// ─── Type icon map ─────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<QuestionType, React.ReactNode> = {
  short_answer: <Type size={13} />,
  paragraph: <AlignLeft size={13} />,
  multiple_choice: <MinusSquare size={13} />,
  checkboxes: <CheckSquare size={13} />,
  dropdown: <List size={13} />,
  linear_scale: <SlidersHorizontal size={13} />,
  rating: <Star size={13} />,
  date: <Calendar size={13} />,
  time: <Clock size={13} />,
};

// ─── TypeBadge ────────────────────────────────────────────────────────────────

export function TypeBadge({ type }: { type: QuestionType }) {
  const meta = QUESTION_TYPE_META.find((m) => m.value === type)!;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        meta.badgeColor,
      )}
    >
      {TYPE_ICONS[type]}
      {meta.label}
    </span>
  );
}

// ─── TypeDropdown ─────────────────────────────────────────────────────────────

const GROUPS: { key: string; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "choice", label: "Choice" },
  { key: "scale", label: "Scale" },
  { key: "datetime", label: "Date & Time" },
];

interface TypeDropdownProps {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
}

export function TypeDropdown({ value, onChange }: TypeDropdownProps) {
  return (
    <div className="relative group/dd">
      <button className="flex items-center gap-1.5 focus:outline-none">
        <TypeBadge type={value} />
        <ChevronDown size={12} className="text-rose-500" />
      </button>

      {/* Dropdown panel */}
      <div className="absolute left-0 top-full mt-1.5 z-50 hidden group-focus-within/dd:block w-52 bg-white border border-rose-200 rounded-xl shadow-2xl shadow-rose-200/40 overflow-hidden">
        {GROUPS.map((group) => {
          const items = QUESTION_TYPE_META.filter((m) => m.group === group.key);
          return (
            <div key={group.key}>
              <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-rose-500">
                {group.label}
              </p>
              {items.map((meta) => (
                <button
                  key={meta.value}
                  onClick={() => onChange(meta.value)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                    value === meta.value
                      ? "text-rose-900 bg-rose-100"
                      : "text-rose-700 hover:bg-rose-50 hover:text-rose-900",
                  )}
                >
                  {TYPE_ICONS[meta.value]}
                  {meta.label}
                  {value === meta.value && (
                    <span className="ml-auto text-pink-500 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-500 mb-2 mt-3">
      {children}
    </p>
  );
}

// ─── OptionInput (reusable row for MCQ / Checkboxes / Dropdown) ───────────────

interface OptionInputProps {
  label: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (val: string) => void;
  onDelete: () => void;
  canDelete: boolean;
  selectIcon: React.ReactNode; // circle / checkbox / list indicator
}

export function OptionInput({
  label,
  value,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  canDelete,
  selectIcon,
}: OptionInputProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSelect}
        className={cn(
          "w-7 h-7 rounded-full text-xs font-bold border-2 shrink-0 flex items-center justify-center transition-all duration-200",
          isSelected
            ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30"
            : "border-rose-300 text-rose-500 hover:border-rose-400",
        )}
        title={isSelected ? "Correct answer" : "Mark as correct"}
      >
        {isSelected ? "✓" : label}
      </button>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Option ${label}`}
        className="flex-1 bg-white border border-rose-200 rounded-lg px-3 py-1.5 text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20"
      />

      <button
        onClick={onDelete}
        disabled={!canDelete}
        className="text-rose-400 hover:text-red-500 disabled:opacity-20 transition-colors shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
