"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";

interface DateFilterProps {
  onFilterChange: (filter: DateFilter) => void;
}

export type DateFilter = {
  type: "all" | "today" | "week" | "month" | "year" | "custom";
  startDate?: string;
  endDate?: string;
};

export function DateFilter({ onFilterChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] =
    useState<DateFilter["type"]>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const filterOptions = [
    { value: "all", label: "All Photos" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ] as const;

  const handleFilterSelect = (type: DateFilter["type"]) => {
    setSelectedFilter(type);

    if (type !== "custom") {
      onFilterChange({ type });
      setIsOpen(false);
    }
  };

  const handleCustomFilter = () => {
    if (customStart && customEnd) {
      onFilterChange({
        type: "custom",
        startDate: customStart,
        endDate: customEnd,
      });
      setIsOpen(false);
    }
  };

  const clearFilter = () => {
    setSelectedFilter("all");
    setCustomStart("");
    setCustomEnd("");
    onFilterChange({ type: "all" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
          ${
            selectedFilter !== "all"
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
              : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700"
          }
        `}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">
          {filterOptions.find((f) => f.value === selectedFilter)?.label}
        </span>
        {selectedFilter !== "all" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFilter();
            }}
            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 z-20 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden min-w-62.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterSelect(option.value)}
                  className={`
                    w-full px-4 py-2.5 rounded-xl text-left transition-colors text-sm
                    ${
                      selectedFilter === option.value
                        ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {selectedFilter === "custom" && (
              <div className="p-4 border-t border-gray-200 dark:border-zinc-700 space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    From
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    To
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                  />
                </div>
                <button
                  onClick={handleCustomFilter}
                  disabled={!customStart || !customEnd}
                  className="w-full px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 dark:disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed text-sm"
                >
                  Apply Filter
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
