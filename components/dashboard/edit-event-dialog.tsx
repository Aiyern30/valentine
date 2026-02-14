"use client";

import { useState, useEffect } from "react";
import { updateMilestone, deleteMilestone } from "@/lib/actions";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  X,
  Loader2,
  Calendar,
  PartyPopper,
  Heart,
  Clock,
  ChevronDown,
  Bell,
  Trash2,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  milestone_date: string;
  end_date?: string;
  milestone_type: string;
  reminder_type?: string;
  reminder_time?: string;
  advance_days?: number;
  advance_hours?: number;
  advance_minutes?: number;
}

interface EditEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

const REMINDER_TYPES = [
  { id: "none", label: "No Reminder" },
  { id: "day_of", label: "Remind on the day" },
  { id: "in_advance", label: "Remind in advance" },
];

const DAY_OPTIONS = Array.from({ length: 366 }, (_, i) => ({
  value: i.toString(),
  label: i === 0 ? "0 days" : i === 1 ? "1 day" : `${i} days`,
}));

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: i === 0 ? "0 hours" : i === 1 ? "1 hour" : `${i} hours`,
}));

const MINUTE_OPTIONS = [
  { value: "0", label: "0 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
];

const EVENT_TYPES = [
  { id: "birthday", label: "Birthday", icon: PartyPopper },
  { id: "anniversary", label: "Anniversary", icon: Heart },
  { id: "countdown", label: "Countdown", icon: Clock },
  { id: "other", label: "Other", icon: Calendar },
];

export function EditEventDialog({
  isOpen,
  onClose,
  milestone,
}: EditEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(EVENT_TYPES[0].id);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  // Load milestone data when dialog opens
  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title);
      setDescription(milestone.description || "");
      setSelectedType(milestone.milestone_type || "birthday");
      setStartDate(new Date(milestone.milestone_date));
    }
  }, [milestone]);

  if (!isOpen || !milestone) return null;

  const currentType =
    EVENT_TYPES.find((t) => t.id === selectedType) || EVENT_TYPES[0];

  async function handleSubmit(formData: FormData) {
    if (!milestone) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add dates to formData
      if (startDate) {
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, '0');
        const day = String(startDate.getDate()).padStart(2, '0');
        formData.set("date", `${year}-${month}-${day}`);
      }

      formData.set("id", milestone.id);

      const result = await updateMilestone(formData);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (
      !milestone ||
      !confirm("Are you sure you want to delete this milestone?")
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      const result = await deleteMilestone(milestone.id);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        router.refresh();
      }
    } catch {
      setError("Failed to delete milestone.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
        <div className="p-8 pb-4 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 italic font-dancing">
            Edit Milestone
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sarah's Birthday"
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Date
                </label>
                <div className="custom-datepicker-wrapper">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                    calendarClassName="custom-calendar"
                    showPopperArrow={false}
                    popperPlacement="bottom-start"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Type
                </label>
                <div className="relative">
                  <input
                    type="hidden"
                    name="milestone_type"
                    value={selectedType}
                  />
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
                      <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details..."
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="pt-6 flex items-center justify-between">"

                  <button
                    type="button"
                    onClick={() =>
                      setIsReminderSelectOpen(!isReminderSelectOpen)
                    }
                    className={`
                      w-full px-5 py-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left
                      ${
                        isReminderSelectOpen
                          ? "border-rose-500 ring-4 ring-rose-500/10 bg-white dark:bg-zinc-900"
                          : "border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50"
                      }
                    `}
                  >
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {currentReminder.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isReminderSelectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isReminderSelectOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsReminderSelectOpen(false)}
                      />
                      <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                        {REMINDER_TYPES.map((reminder) => (
                          <button
                            key={reminder.id}
                            type="button"
                            onClick={() => {
                              setSelectedReminder(reminder.id);
                              setIsReminderSelectOpen(false);
                            }}
                            className={`
                              w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left
                              ${
                                selectedReminder === reminder.id
                                  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                              }
                            `}
                          >
                            {reminder.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedReminder === "day_of" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                    Reminder Time
                  </label>
                  <input
                    name="reminderTime"
                    type="time"
                    defaultValue={milestone?.reminder_time || "09:00"}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                  />
                </div>
              )}

              {selectedReminder === "in_advance" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                    Remind Before
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        Days
                      </label>
                      <input
                        type="hidden"
                        name="advanceDays"
                        value={selectedDays}
                      />
                      <select
                        value={selectedDays}
                        onChange={(e) => setSelectedDays(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-sm text-gray-900 dark:text-gray-100"
                      >
                        {DAY_OPTIONS.slice(0, 31).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        Hours
                      </label>
                      <input
                        type="hidden"
                        name="advanceHours"
                        value={selectedHours}
                      />
                      <select
                        value={selectedHours}
                        onChange={(e) => setSelectedHours(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-sm text-gray-900 dark:text-gray-100"
                      >
                        {HOUR_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        Minutes
                      </label>
                      <input
                        type="hidden"
                        name="advanceMinutes"
                        value={selectedMinutes}
                      />
                      <select
                        value={selectedMinutes}
                        onChange={(e) => setSelectedMinutes(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-sm text-gray-900 dark:text-gray-100"
                      >
                        {MINUTE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
                className="px-6 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading || isDeleting}
                  className="px-6 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isDeleting}
                  className="px-8 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
