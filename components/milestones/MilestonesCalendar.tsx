/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { Heart, Gift, Calendar as CalendarIcon, Star } from "lucide-react";
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog";
import { EditEventDialog } from "@/components/dashboard/edit-event-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Milestone {
  id: string;
  title: string;
  description?: string;
  milestone_date: string;
  end_date?: string;
  milestone_type: string;
  category?: string;
  reminder_type?: string;
  reminder_time?: string;
  advance_days?: number;
  advance_hours?: number;
  advance_minutes?: number;
}

interface MilestoneCalendarProps {
  milestones: Milestone[];
}

export function MilestoneCalendar({ milestones }: MilestoneCalendarProps) {
  const [view, setView] = useState<View>("month");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );

  // Transform milestones into calendar events
  const events = milestones.map((milestone) => {
    const startDate = new Date(milestone.milestone_date);
    let endDate = new Date(milestone.milestone_date);

    // If milestone has an end_date field, use it and add 1 day for proper display
    if (milestone.end_date) {
      endDate = new Date(milestone.end_date);
      // Add 1 day to end date so it shows through the last day
      // This is required by react-big-calendar to display multi-day events correctly
      endDate.setDate(endDate.getDate() + 1);
    }

    return {
      id: milestone.id,
      title: milestone.title,
      start: startDate,
      end: endDate,
      resource: milestone,
    };
  });

  // Get icon based on type or category
  const getCategoryIcon = (type?: string, category?: string) => {
    const typeOrCategory = (type || category || "").toLowerCase();

    switch (typeOrCategory) {
      case "anniversary":
        return <Heart className="w-3 h-3" />;
      case "birthday":
        return <Gift className="w-3 h-3" />;
      case "date":
      case "countdown":
        return <CalendarIcon className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  // Custom event styling with enhanced colors
  const eventStyleGetter = (event: any) => {
    const type = (
      event.resource.milestone_type ||
      event.resource.category ||
      ""
    ).toLowerCase();

    let backgroundColor = "#ec4899"; // Default rose-500
    let borderColor = "#be185d"; // Default rose-700

    switch (type) {
      case "anniversary":
        backgroundColor = "#ef4444"; // red-500
        borderColor = "#dc2626"; // red-600
        break;
      case "birthday":
        backgroundColor = "#8b5cf6"; // purple-500
        borderColor = "#7c3aed"; // purple-600
        break;
      case "countdown":
      case "date":
        backgroundColor = "#3b82f6"; // blue-500
        borderColor = "#2563eb"; // blue-600
        break;
      case "achievement":
      case "other":
        backgroundColor = "#10b981"; // green-500
        borderColor = "#059669"; // green-600
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        opacity: 0.95,
        color: "white",
        border: `2px solid ${borderColor}`,
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "600",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
    };
  };

  // Custom event component
  const EventComponent = ({ event }: any) => (
    <div className="flex items-center gap-1 px-1">
      {getCategoryIcon(event.resource.milestone_type, event.resource.category)}
      <span className="truncate">{event.title}</span>
    </div>
  );

  // Handle event click (open edit dialog)
  const handleSelectEvent = (event: any) => {
    setSelectedMilestone(event.resource);
    setIsEditDialogOpen(true);
  };

  // Handle slot selection (clicking on empty calendar slots)
  const handleSelectSlot = ({ start }: { start: Date; end: Date }) => {
    setSelectedDate(start);
    setIsCreateDialogOpen(true);
  };

  // Custom Toolbar Component for Year/Month selection
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    const handleYearChange = (yearStr: string) => {
      const year = parseInt(yearStr);
      const newDate = new Date(toolbar.date);
      newDate.setFullYear(year);
      toolbar.onNavigate("DATE", newDate);
    };

    const handleMonthChange = (monthStr: string) => {
      const month = parseInt(monthStr);
      const newDate = new Date(toolbar.date);
      newDate.setMonth(month);
      toolbar.onNavigate("DATE", newDate);
    };

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 10; i++) {
      years.push(i);
    }

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="rbc-toolbar">
        <div className="rbc-btn-group">
          <button type="button" onClick={goToToday}>
            Today
          </button>
          <button type="button" onClick={goToBack}>
            Back
          </button>
          <button type="button" onClick={goToNext}>
            Next
          </button>
        </div>

        <div className="rbc-toolbar-label">
          <Select
            value={toolbar.date.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-10 w-35 px-3 py-0 bg-background border-2 font-bold rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2">
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={toolbar.date.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-10 w-27.5 px-3 py-0 bg-background border-2 font-bold rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rbc-btn-group">
          <button
            type="button"
            onClick={() => toolbar.onView("month")}
            className={toolbar.view === "month" ? "rbc-active" : ""}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => toolbar.onView("week")}
            className={toolbar.view === "week" ? "rbc-active" : ""}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => toolbar.onView("day")}
            className={toolbar.view === "day" ? "rbc-active" : ""}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => toolbar.onView("agenda")}
            className={toolbar.view === "agenda" ? "rbc-active" : ""}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="milestone-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
          toolbar: CustomToolbar,
        }}
        popup
        date={currentDate}
        onNavigate={setCurrentDate}
        tooltipAccessor={(event: any) =>
          event.resource.description || event.title
        }
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
      />

      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
      />

      <EditEventDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />
    </div>
  );
}
