"use client";

import { cn } from "@/lib/utils";
import { LinearScaleConfig } from "@/types/quiz";
import { SectionLabel } from "./sharedUI";

interface LinearScaleEditorProps {
  config: LinearScaleConfig;
  correctOption: string;
  onConfigChange: (c: LinearScaleConfig) => void;
  onCorrectChange: (val: string) => void;
}

export function LinearScaleEditor({
  config,
  correctOption,
  onConfigChange,
  onCorrectChange,
}: LinearScaleEditorProps) {
  const selected = parseInt(correctOption) || config.min;
  const range = Array.from(
    { length: config.max - config.min + 1 },
    (_, i) => config.min + i,
  );

  return (
    <div>
      {/* Config row */}
      <SectionLabel>Scale configuration</SectionLabel>
      <div className="grid grid-cols-2 gap-3 mb-1">
        <div>
          <label className="text-[10px] text-rose-500 uppercase tracking-wider block mb-1">
            Min value
          </label>
          <input
            type="number"
            min={0}
            max={1}
            value={config.min}
            onChange={(e) => {
              let val = parseInt(e.target.value) || 0;
              if (val < 0) val = 0;
              if (val > 1) val = 1;
              onConfigChange({ ...config, min: val });
            }}
            className="w-full bg-white border border-rose-200 rounded-lg px-3 py-1.5 text-sm text-rose-900 focus:outline-none focus:border-pink-400"
          />
        </div>
        <div>
          <label className="text-[10px] text-rose-500 uppercase tracking-wider block mb-1">
            Max value
          </label>
          <input
            type="number"
            min={Math.max(2, config.min + 1)}
            max={10}
            value={config.max}
            onChange={(e) => {
              let val = parseInt(e.target.value) || 10;
              if (val > 10) val = 10;
              if (val <= config.min) val = config.min + 1;
              onConfigChange({ ...config, max: val });
            }}
            className="w-full bg-white border border-rose-200 rounded-lg px-3 py-1.5 text-sm text-rose-900 focus:outline-none focus:border-pink-400"
          />
        </div>
        <div>
          <label className="text-[10px] text-rose-500 uppercase tracking-wider block mb-1">
            Min label (optional)
          </label>
          <input
            value={config.min_label}
            onChange={(e) =>
              onConfigChange({ ...config, min_label: e.target.value })
            }
            placeholder="e.g. Not at all"
            className="w-full bg-white border border-rose-200 rounded-lg px-3 py-1.5 text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-pink-400"
          />
        </div>
        <div>
          <label className="text-[10px] text-rose-500 uppercase tracking-wider block mb-1">
            Max label (optional)
          </label>
          <input
            value={config.max_label}
            onChange={(e) =>
              onConfigChange({ ...config, max_label: e.target.value })
            }
            placeholder="e.g. Extremely"
            className="w-full bg-white border border-rose-200 placeholder:text-rose-300 rounded-lg px-3 py-1.5 text-sm text-rose-900 focus:outline-none focus:border-pink-400"
          />
        </div>
      </div>

      {/* Scale picker */}
      <SectionLabel>
        Your Answer:{" "}
        <span className="text-pink-400 font-bold text-sm">{selected}</span>
      </SectionLabel>

      {/* Scrollable number row */}
      <div className="flex gap-1.5 flex-wrap">
        {range.map((n) => (
          <button
            key={n}
            onClick={() => onCorrectChange(String(n))}
            className={cn(
              "w-8 h-8 rounded-lg text-xs font-semibold border transition-all duration-150",
              selected === n
                ? "bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/30"
                : "bg-white border-rose-200 text-rose-600 hover:border-rose-300 hover:text-rose-800",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Labels */}
      {(config.min_label || config.max_label) && (
        <div className="flex justify-between text-xs text-rose-500 mt-1.5">
          <span>{config.min_label}</span>
          <span>{config.max_label}</span>
        </div>
      )}
    </div>
  );
}
