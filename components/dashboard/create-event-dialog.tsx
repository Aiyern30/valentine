"use client";

import { useState, useEffect } from "react";
import { createMilestone } from "@/lib/actions";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Loader2,
  Calendar,
  PartyPopper,
  Heart,
  Clock,
  Bell,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export function CreateEventDialog({
  isOpen,
  onClose,
  selectedDate,
}: CreateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(EVENT_TYPES[0].id);
  const [selectedReminder, setSelectedReminder] = useState(
    REMINDER_TYPES[0].id,
  );
  const [startDate, setStartDate] = useState<Date | null>(
    selectedDate || new Date(),
  );
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDays, setSelectedDays] = useState("1");
  const [selectedHours, setSelectedHours] = useState("0");
  const [selectedMinutes, setSelectedMinutes] = useState("0");
  const router = useRouter();

  // Update start date when selectedDate changes
  useEffect(() => {
    if (
      selectedDate &&
      selectedDate instanceof Date &&
      !isNaN(selectedDate.getTime())
    ) {
      setStartDate(selectedDate);
    }
  }, [selectedDate]);

  const currentType =
    EVENT_TYPES.find((t) => t.id === selectedType) || EVENT_TYPES[0];

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      // Add dates to formData
      if (startDate) {
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const day = String(startDate.getDate()).padStart(2, "0");
        formData.set("date", `${year}-${month}-${day}`);
      }
      if (endDate && selectedType === "other") {
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const day = String(endDate.getDate()).padStart(2, "0");
        formData.set("endDate", `${year}-${month}-${day}`);
      }

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 rounded-[32px] border-gray-100 dark:border-zinc-800 flex flex-col">
        <DialogHeader className="p-6 sm:p-8 pb-4 border-b border-gray-50 dark:border-zinc-800 space-y-0 shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 italic font-dancing">
            Create New Milestone
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <form action={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Milestone Title</Label>
              <Input
                name="title"
                type="text"
                required
                placeholder="e.g. Sarah's Birthday"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>
                  {selectedType === "other" ? "Start Date" : "Date"}
                </Label>
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

              {selectedType === "other" && (
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <div className="custom-datepicker-wrapper">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      dateFormat="MM/dd/yyyy"
                      minDate={startDate || undefined}
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      calendarClassName="custom-calendar"
                      showPopperArrow={false}
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Type</Label>
                <input
                  type="hidden"
                  name="milestone_type"
                  value={selectedType}
                />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <currentType.icon className="w-4 h-4 text-rose-500" />
                      <span>{currentType.label}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-3">
                          <type.icon
                            className={`w-4 h-4 ${selectedType === type.id ? "text-rose-500" : "text-gray-400"}`}
                          />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                name="description"
                rows={3}
                placeholder="Add some details..."
              />
            </div>

            {/* Reminder Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-400" />
                  Reminder
                </Label>
                <input
                  type="hidden"
                  name="reminderType"
                  value={selectedReminder}
                />
                <Select
                  value={selectedReminder}
                  onValueChange={setSelectedReminder}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REMINDER_TYPES.map((reminder) => (
                      <SelectItem key={reminder.id} value={reminder.id}>
                        {reminder.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reminder Time (for day_of reminders) */}
              {selectedReminder === "day_of" && (
                <div className="space-y-2">
                  <Label className="font-medium">Reminder Time</Label>
                  <Input name="reminderTime" type="time" defaultValue="09:00" />
                </div>
              )}

              {/* Advance Reminder (for in_advance reminders) */}
              {selectedReminder === "in_advance" && (
                <div className="space-y-2">
                  <Label className="font-medium">Remind Before</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Days Dropdown */}
                    <div>
                      <Label className="text-xs">Days</Label>
                      <input
                        type="hidden"
                        name="advanceDays"
                        value={selectedDays}
                      />
                      <Select
                        value={selectedDays}
                        onValueChange={setSelectedDays}
                      >
                        <SelectTrigger className="rounded-xl px-3 py-2.5 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-40">
                          {DAY_OPTIONS.slice(0, 31).map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="px-3 py-1.5 text-xs"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hours Dropdown */}
                    <div>
                      <Label className="text-xs">Hours</Label>
                      <input
                        type="hidden"
                        name="advanceHours"
                        value={selectedHours}
                      />
                      <Select
                        value={selectedHours}
                        onValueChange={setSelectedHours}
                      >
                        <SelectTrigger className="rounded-xl px-3 py-2.5 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-40">
                          {HOUR_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="px-3 py-1.5 text-xs"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Minutes Dropdown */}
                    <div>
                      <Label className="text-xs">Minutes</Label>
                      <input
                        type="hidden"
                        name="advanceMinutes"
                        value={selectedMinutes}
                      />
                      <Select
                        value={selectedMinutes}
                        onValueChange={setSelectedMinutes}
                      >
                        <SelectTrigger className="rounded-xl px-3 py-2.5 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-40">
                          {MINUTE_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="px-3 py-1.5 text-xs"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-2xl text-gray-600 dark:text-gray-400 font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                size="xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>Create Milestone</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
