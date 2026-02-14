"use client";

import { useState } from "react";
import { createMilestone } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  X,
  Loader2,
  Calendar,
  PartyPopper,
  Heart,
  Clock,
  ChevronDown,
} from "lucide-react";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
}

const EVENT_TYPES = [
  { id: "birthday", label: "Birthday", icon: PartyPopper },
  { id: "anniversary", label: "Anniversary", icon: Heart },
  { id: "countdown", label: "Countdown", icon: Clock },
  { id: "other", label: "Other", icon: Calendar },
];

export function CreateEventDialog({
  isOpen,
  onClose,
  selectedDate,
}: CreateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(EVENT_TYPES[0].id);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const currentType =
    EVENT_TYPES.find((t) => t.id === selectedType) || EVENT_TYPES[0];

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await createMilestone(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Success - close dialog and refresh
        onClose();
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
        <div className="p-8 pb-4 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 italic font-dancing">
            Create New Milestone
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form action={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Milestone Title
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="e.g. Sarah's Birthday"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Date
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={
                  selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                }
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Type
              </label>
              <div className="relative">
                <input type="hidden" name="type" value={selectedType} />
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className={`
                    w-full px-5 py-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left
                    ${
                      isSelectOpen
                        ? "border-rose-500 ring-4 ring-rose-500/10 bg-white dark:bg-zinc-900"
                        : "border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <currentType.icon className="w-4 h-4 text-rose-500" />
                    <span className="font-medium">{currentType.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isSelectOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isSelectOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSelectOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      {EVENT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setSelectedType(type.id);
                            setIsSelectOpen(false);
                          }}
                          className={`
                            w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left
                            ${
                              selectedType === type.id
                                ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                            }
                          `}
                        >
                          <type.icon
                            className={`w-4 h-4 ${selectedType === type.id ? "text-rose-500" : "text-gray-400"}`}
                          />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Add some details..."
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Milestone</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
