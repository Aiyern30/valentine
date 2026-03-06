// ─── Question Types ────────────────────────────────────────────────────────────

export type QuestionType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "linear_scale"
  | "rating"
  | "date"
  | "time";

// ─── Option shapes ─────────────────────────────────────────────────────────────

export interface ChoiceOption {
  key: string;
  label: string;
}

export interface LinearScaleConfig {
  min: number;
  max: number;
  min_label: string;
  max_label: string;
}

export interface RatingConfig {
  max: number; // 5 or 10
  icon: "star" | "heart";
}

// ─── Question ─────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  /**
   * - multiple_choice / checkboxes / dropdown → ChoiceOption[]
   * - linear_scale                             → LinearScaleConfig
   * - rating                                   → RatingConfig
   * - short_answer / paragraph / date / time  → null
   */
  options: ChoiceOption[] | LinearScaleConfig | RatingConfig | null;
  /**
   * Creator's own answer (the "correct" reference answer):
   * - multiple_choice / dropdown  → option key  e.g. "A"
   * - checkboxes                  → comma-separated keys e.g. "A,C"
   * - linear_scale                → stringified number e.g. "7"
   * - rating                      → stringified number e.g. "4"
   * - short_answer / paragraph    → free text
   * - date                        → ISO date string "2024-02-14"
   * - time                        → "HH:MM"
   */
  correct_option: string;
  required: boolean;
}

// ─── Type metadata (icon, label, colour) ──────────────────────────────────────

export interface QuestionTypeMeta {
  value: QuestionType;
  label: string;
  group: "text" | "choice" | "scale" | "datetime";
  badgeColor: string; // tailwind classes
}

export const QUESTION_TYPE_META: QuestionTypeMeta[] = [
  // Text
  {
    value: "short_answer",
    label: "Short Answer",
    group: "text",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
  {
    value: "paragraph",
    label: "Paragraph",
    group: "text",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
  // Choice
  {
    value: "multiple_choice",
    label: "Multiple Choice",
    group: "choice",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  {
    value: "checkboxes",
    label: "Checkboxes",
    group: "choice",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  {
    value: "dropdown",
    label: "Dropdown",
    group: "choice",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  // Scale
  {
    value: "linear_scale",
    label: "Linear Scale",
    group: "scale",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    value: "rating",
    label: "Rating",
    group: "scale",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  // Date/Time
  {
    value: "date",
    label: "Date",
    group: "datetime",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    value: "time",
    label: "Time",
    group: "datetime",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
];

// ─── Factories ────────────────────────────────────────────────────────────────

export function makeDefaultQuestion(): Question {
  return {
    id: Math.random().toString(36).slice(2, 9),
    question_text: "",
    question_type: "multiple_choice",
    options: [
      { key: "A", label: "" },
      { key: "B", label: "" },
    ],
    correct_option: "A",
    required: false,
  };
}

export function makeDefaultsForType(
  type: QuestionType,
): Pick<Question, "options" | "correct_option"> {
  switch (type) {
    case "short_answer":
    case "paragraph":
      return { options: null, correct_option: "" };
    case "multiple_choice":
    case "dropdown":
      return {
        options: [
          { key: "A", label: "" },
          { key: "B", label: "" },
        ],
        correct_option: "A",
      };
    case "checkboxes":
      return {
        options: [
          { key: "A", label: "" },
          { key: "B", label: "" },
        ],
        correct_option: "A",
      };
    case "linear_scale":
      return {
        options: { min: 1, max: 10, min_label: "", max_label: "" },
        correct_option: "5",
      };
    case "rating":
      return {
        options: { max: 5, icon: "star" },
        correct_option: "3",
      };
    case "date":
      return { options: null, correct_option: "" };
    case "time":
      return { options: null, correct_option: "" };
    default:
      return { options: null, correct_option: "" };
  }
}
