"use client";

import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatingConfig } from "@/types/quiz";
import { SectionLabel } from "./sharedUI";

interface RatingEditorProps {
  config: RatingConfig;
  correctOption: string;
  onConfigChange: (c: RatingConfig) => void;
  onCorrectChange: (val: string) => void;
}

export function RatingEditor({
  config,
  correctOption,
  onConfigChange,
  onCorrectChange,
}: RatingEditorProps) {
  const selected = parseInt(correctOption) || 0;

  return (
    <div>
      <SectionLabel>Rating configuration</SectionLabel>

      {/* Icon picker */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-zinc-500">Icon:</span>
        {(["star", "heart"] as const).map((icon) => (
          <button
            key={icon}
            onClick={() => onConfigChange({ ...config, icon })}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all",
              config.icon === icon
                ? "border-pink-500 text-pink-300 bg-pink-500/10"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
            )}
          >
            {icon === "star" ? <Star size={13} /> : <Heart size={13} />}
            {icon.charAt(0).toUpperCase() + icon.slice(1)}
          </button>
        ))}

        {/* Max stars selector */}
        <span className="text-xs text-zinc-500 ml-3">Max:</span>
        {[5, 10].map((n) => (
          <button
            key={n}
            onClick={() => onConfigChange({ ...config, max: n })}
            className={cn(
              "w-8 h-7 rounded-lg border text-xs font-semibold transition-all",
              config.max === n
                ? "border-pink-500 text-pink-300 bg-pink-500/10"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Rating preview */}
      <SectionLabel>
        Your Answer:{" "}
        <span className="text-pink-400 font-bold text-sm">
          {selected || "—"}
        </span>
      </SectionLabel>

      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: config.max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onCorrectChange(String(n))}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            {config.icon === "star" ? (
              <Star
                size={22}
                className={cn(
                  "transition-colors",
                  n <= selected
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-700 fill-transparent",
                )}
              />
            ) : (
              <Heart
                size={22}
                className={cn(
                  "transition-colors",
                  n <= selected
                    ? "fill-pink-500 text-pink-500"
                    : "text-zinc-700 fill-transparent",
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
