"use client";

import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { Heart, Gift, Calendar as CalendarIcon, Star } from "lucide-react";

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
  category?: string;
}

interface MilestoneCalendarProps {
  milestones: Milestone[];
}

export function MilestoneCalendar({ milestones }: MilestoneCalendarProps) {
  const [view, setView] = useState<View>("month");

  // Transform milestones into calendar events
  const events = milestones.map((milestone) => ({
    id: milestone.id,
    title: milestone.title,
    start: new Date(milestone.milestone_date),
    end: new Date(milestone.milestone_date),
    resource: milestone,
  }));

  // Get icon based on category
  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "anniversary":
        return <Heart className="w-3 h-3" />;
      case "birthday":
        return <Gift className="w-3 h-3" />;
      case "date":
        return <CalendarIcon className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    const category = event.resource.category?.toLowerCase();
    let backgroundColor = "#ec4899"; // Default rose-500

    switch (category) {
      case "anniversary":
        backgroundColor = "#ef4444"; // red-500
        break;
      case "birthday":
        backgroundColor = "#8b5cf6"; // purple-500
        break;
      case "date":
        backgroundColor = "#3b82f6"; // blue-500
        break;
      case "achievement":
        backgroundColor = "#10b981"; // green-500
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "500",
      },
    };
  };

  // Custom event component
  const EventComponent = ({ event }: any) => (
    <div className="flex items-center gap-1 px-1">
      {getCategoryIcon(event.resource.category)}
      <span className="truncate">{event.title}</span>
    </div>
  );

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
        }

        .rbc-event:focus {
          outline: 2px solid rgb(244 63 94);
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
      />
    </div>
  );
}
