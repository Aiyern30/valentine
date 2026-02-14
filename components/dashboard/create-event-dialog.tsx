"use client";

import { useState, useEffect } from "react";
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
  Bell,
} from "lucide-react";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
}

const REMINDER_TYPES = [
  { id: "none", label: "No Reminder" },
  { id: "day_of", label: "Remind on the day" },
  { id: "in_advance", label: "Remind in advance" },
];

const DAY_OPTIONS = Array.from({ length: 366 }, (_, i) => ({
  value: i.toString(),
  label: i === 0 ? "0 days" : i === 1 ? "1 day" : `${i} days`
}));

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: i === 0 ? "0 hours" : i === 1 ? "1 hour" : `${i} hours`
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

export function CreateEventDialog({
  isOpen,
  onClose,
  selectedDate,
}: CreateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(EVENT_TYPES[0].id);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(REMINDER_TYPES[0].id);
  const [isReminderSelectOpen, setIsReminderSelectOpen] = useState(false);
  const [startDate, setStartDate] = useState(selectedDate ? selectedDate.toISOString().split("T")[0] : "");
  const [selectedDays, setSelectedDays] = useState("1");
  const [selectedHours, setSelectedHours] = useState("0");
  const [selectedMinutes, setSelectedMinutes] = useState("0");
  const [isDaysOpen, setIsDaysOpen] = useState(false);
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [isMinutesOpen, setIsMinutesOpen] = useState(false);
  const router = useRouter();

  // Update start date when selectedDate changes
  useEffect(() => {
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      setStartDate(selectedDate.toISOString().split("T")[0]);
    }
  }, [selectedDate]);

  if (!isOpen) return null;

  const currentType =
    EVENT_TYPES.find((t) => t.id === selectedType) || EVENT_TYPES[0];
  const currentReminder =
    REMINDER_TYPES.find((r) => r.id === selectedReminder) || REMINDER_TYPES[0];

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
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
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
                {selectedType === "other" ? "Start Date" : "Date"}
              </label>
              <input
                name="date"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                style={{
                  colorScheme: 'auto'
                }}
              />
            </div>

            {selectedType === "other" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  End Date (Optional)
                </label>
                <input
                  name="endDate"
                  type="date"
                  min={startDate}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                  style={{
                    colorScheme: 'auto'
                  }}
                />
              </div>
            )}

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

          {/* Reminder Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-400" />
                Reminder
              </label>
              <div className="relative">
                <input type="hidden" name="reminderType" value={selectedReminder} />
                <button
                  type="button"
                  onClick={() => setIsReminderSelectOpen(!isReminderSelectOpen)}
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
                    <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
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

            {/* Reminder Time (for day_of reminders) */}
            {selectedReminder === "day_of" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                  Reminder Time
                </label>
                <input
                  name="reminderTime"
                  type="time"
                  defaultValue="09:00"
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                />
              </div>
            )}

            {/* Advance Reminder (for in_advance reminders) */}
            {selectedReminder === "in_advance" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                  Remind Before
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Days Dropdown */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">Days</label>
                    <div className="relative">
                      <input type="hidden" name="advanceDays" value={selectedDays} />
                      <button
                        type="button"
                        onClick={() => setIsDaysOpen(!isDaysOpen)}
                        className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between text-left text-sm ${
                          isDaysOpen
                            ? "border-rose-500 ring-2 ring-rose-500/10 bg-white dark:bg-zinc-900"
                            : "border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50"
                        }`}
                      >
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {DAY_OPTIONS.find(d => d.value === selectedDays)?.label || "1 day"}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isDaysOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isDaysOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsDaysOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700/50 rounded-xl shadow-xl max-h-40 overflow-y-auto py-1">
                            {DAY_OPTIONS.slice(0, 31).map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setSelectedDays(option.value);
                                  setIsDaysOpen(false);
                                }}
                                className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                                  selectedDays === option.value
                                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Hours Dropdown */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">Hours</label>
                    <div className="relative">
                      <input type="hidden" name="advanceHours" value={selectedHours} />
                      <button
                        type="button"
                        onClick={() => setIsHoursOpen(!isHoursOpen)}
                        className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between text-left text-sm ${
                          isHoursOpen
                            ? "border-rose-500 ring-2 ring-rose-500/10 bg-white dark:bg-zinc-900"
                            : "border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50"
                        }`}
                      >
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {HOUR_OPTIONS.find(h => h.value === selectedHours)?.label || "0 hours"}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isHoursOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isHoursOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsHoursOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700/50 rounded-xl shadow-xl max-h-40 overflow-y-auto py-1">
                            {HOUR_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setSelectedHours(option.value);
                                  setIsHoursOpen(false);
                                }}
                                className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                                  selectedHours === option.value
                                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Minutes Dropdown */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">Minutes</label>
                    <div className="relative">
                      <input type="hidden" name="advanceMinutes" value={selectedMinutes} />
                      <button
                        type="button"
                        onClick={() => setIsMinutesOpen(!isMinutesOpen)}
                        className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between text-left text-sm ${
                          isMinutesOpen
                            ? "border-rose-500 ring-2 ring-rose-500/10 bg-white dark:bg-zinc-900"
                            : "border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50"
                        }`}
                      >
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {MINUTE_OPTIONS.find(m => m.value === selectedMinutes)?.label || "0 minutes"}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isMinutesOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isMinutesOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsMinutesOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700/50 rounded-xl shadow-xl overflow-hidden py-1">
                            {MINUTE_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setSelectedMinutes(option.value);
                                  setIsMinutesOpen(false);
                                }}
                                className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                                  selectedMinutes === option.value
                                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
