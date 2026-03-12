"use client";

import {
  Question,
  ChoiceOption,
  LinearScaleConfig,
  RatingConfig,
} from "@/types/quiz";
import { CheckboxesEditor } from "./checkboxEditor";
import { DateEditor } from "./dateEditor";
import { DropdownEditor } from "./dropdownEditor";
import { LinearScaleEditor } from "./linearScaleEditor";
import { MultipleChoiceEditor } from "./multiChoiceEditor";
import { ParagraphEditor } from "./paragraphEditor";
import { RatingEditor } from "./ratingEditor";
import { ShortAnswerEditor } from "./shortAnswerEditor";
import { TimeEditor } from "./timeEditor";

interface QuestionEditorProps {
  question: Question;
  onUpdate: (q: Question) => void;
}

/**
 * Renders the correct editor sub-component based on question.question_type.
 * Drop this inside your QuestionCard — it handles everything.
 */
export function QuestionEditor({ question, onUpdate }: QuestionEditorProps) {
  const update = (patch: Partial<Question>) =>
    onUpdate({ ...question, ...patch });

  switch (question.question_type) {
    case "short_answer":
      return (
        <ShortAnswerEditor
          correctOption={question.correct_option}
          onCorrectChange={(val) => update({ correct_option: val })}
        />
      );

    case "paragraph":
      return (
        <ParagraphEditor
          correctOption={question.correct_option}
          onCorrectChange={(val) => update({ correct_option: val })}
        />
      );

    case "multiple_choice":
      return (
        <MultipleChoiceEditor
          options={question.options as ChoiceOption[]}
          correctOption={question.correct_option}
          onChange={(opts) => update({ options: opts })}
          onCorrectChange={(key) => update({ correct_option: key })}
        />
      );

    case "checkboxes":
      return (
        <CheckboxesEditor
          options={question.options as ChoiceOption[]}
          correctOption={question.correct_option}
          onChange={(opts) => update({ options: opts })}
          onCorrectChange={(val) => update({ correct_option: val })}
        />
      );

    case "dropdown":
      return (
        <DropdownEditor
          options={question.options as ChoiceOption[]}
          correctOption={question.correct_option}
          onChange={(opts) => update({ options: opts })}
          onCorrectChange={(key) => update({ correct_option: key })}
        />
      );

    case "linear_scale":
      return (
        <LinearScaleEditor
          config={question.options as LinearScaleConfig}
          correctOption={question.correct_option}
          onConfigChange={(cfg) => update({ options: cfg })}
          onCorrectChange={(val) => update({ correct_option: val })}
        />
      );

    case "rating":
      return (
        <RatingEditor
          config={question.options as RatingConfig}
          correctOption={question.correct_option}
          onConfigChange={(cfg) => update({ options: cfg })}
          onCorrectChange={(val) => update({ correct_option: val })}
        />
      );

    case "date":
      return (
        <DateEditor
          correctOption={question.correct_option}
          onCorrectChange={(val) => update({ correct_option: val })}
        />
      );

    case "time":
      return (
        <TimeEditor
          correctOption={question.correct_option}
          onCorrectChange={(val) => update({ correct_option: val })}
        />
      );

    default:
      return null;
  }
}
