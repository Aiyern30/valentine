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
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
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

  return (
    <div className="milestone-calendar">
      <style jsx global>{`
        .milestone-calendar {
          height: 600px;
        }

        .rbc-calendar {
          font-family: inherit;
        }

        .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          color: rgb(17 24 39);
          border-bottom: 2px solid rgb(243 244 246);
        }

        .dark .rbc-header {
          color: rgb(243 244 246);
          border-bottom-color: rgb(63 63 70);
        }

        .rbc-off-range-bg {
          background: rgb(249 250 251);
        }

        .dark .rbc-off-range-bg {
          background: rgb(24 24 27);
        }

        .rbc-today {
          background-color: rgb(254 242 242);
        }

        .dark .rbc-today {
          background-color: rgb(76 29 29);
        }

        .rbc-month-view,
        .rbc-time-view {
          border: 1px solid rgb(229 231 235);
          border-radius: 12px;
          overflow: hidden;
        }

        .dark .rbc-month-view,
        .dark .rbc-time-view {
          border-color: rgb(63 63 70);
        }

        .rbc-date-cell {
          padding: 8px;
          text-align: right;
        }

        .rbc-date-cell > a {
          color: rgb(75 85 99);
          font-weight: 500;
        }

        .dark .rbc-date-cell > a {
          color: rgb(209 213 219);
        }

        .rbc-now .rbc-date-cell > a {
          color: rgb(244 63 94);
          font-weight: 700;
        }

        .dark .rbc-now .rbc-date-cell > a {
          color: rgb(251 113 133);
        }

        .rbc-event {
          padding: 2px 6px;
          cursor: pointer;
        }

        .rbc-event:hover {
          opacity: 1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .rbc-event:focus {
          outline: 2px solid rgb(244 63 94);
        }

        /* Allow multiple events to stack vertically */
        .rbc-row-segment {
          padding: 1px 2px;
        }

        .rbc-event-label {
          font-size: 0.75rem;
        }

        .rbc-toolbar {
          padding: 16px;
          margin-bottom: 16px;
          background: rgb(249 250 251);
          border-radius: 12px;
          border: 1px solid rgb(229 231 235);
        }

        .dark .rbc-toolbar {
          background: rgb(39 39 42);
          border-color: rgb(63 63 70);
        }

        .rbc-toolbar button {
          color: rgb(75 85 99);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgb(229 231 235);
          background: white;
          font-weight: 500;
          transition: all 0.2s;
        }

        .dark .rbc-toolbar button {
          color: rgb(209 213 219);
          border-color: rgb(63 63 70);
          background: rgb(39 39 42);
        }

        .rbc-toolbar button:hover {
          background: rgb(243 244 246);
          border-color: rgb(209 213 219);
        }

        .dark .rbc-toolbar button:hover {
          background: rgb(63 63 70);
          border-color: rgb(82 82 91);
        }

        .rbc-toolbar button.rbc-active {
          background: rgb(244 63 94);
          color: white;
          border-color: rgb(244 63 94);
        }

        .dark .rbc-toolbar button.rbc-active {
          background: rgb(244 63 94);
          border-color: rgb(244 63 94);
        }

        .rbc-toolbar-label {
          font-weight: 700;
          font-size: 1.125rem;
          color: rgb(17 24 39);
        }

        .dark .rbc-toolbar-label {
          color: rgb(243 244 246);
        }

        /* Show more link styling */
        .rbc-show-more {
          background-color: rgba(244, 63, 94, 0.1);
          color: rgb(244 63 94);
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rbc-show-more:hover {
          background-color: rgba(244, 63, 94, 0.2);
        }

        .dark .rbc-show-more {
          background-color: rgba(244, 63, 94, 0.2);
          color: rgb(251, 113, 133);
        }

        .dark .rbc-show-more:hover {
          background-color: rgba(244, 63, 94, 0.3);
        }
      `}</style>

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
        }}
        popup
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
