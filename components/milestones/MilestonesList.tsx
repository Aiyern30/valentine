"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Heart,
  Calendar,
  Star,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Clock,
  Filter,
} from "lucide-react";
import { EditEventDialog } from "@/components/dashboard/edit-event-dialog";
import type { Milestone } from "@/types";

// Interface for the edit dialog (matching the expected structure)
interface EditDialogMilestone {
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

interface MilestonesListProps {
  milestones: Milestone[];
}

const FILTER_OPTIONS = [
  { id: "all", label: "All", icon: Star, count: 0 },
  { id: "birthday", label: "Birthday", icon: PartyPopper, count: 0 },
  { id: "anniversary", label: "Anniversary", icon: Heart, count: 0 },
  { id: "countdown", label: "Countdown", icon: Clock, count: 0 },
  { id: "other", label: "Other", icon: Calendar, count: 0 },
];

const ITEMS_PER_PAGE = 6;

export function MilestonesList({ milestones }: MilestonesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMilestone, setSelectedMilestone] = useState<EditDialogMilestone | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getCategoryIcon = (category?: string | null) => {
    switch (category?.toLowerCase()) {
      case "anniversary":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "birthday":
        return <PartyPopper className="w-5 h-5 text-purple-500" />;
      case "countdown":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "other":
        return <Calendar className="w-5 h-5 text-green-500" />;
      default:
        return <Star className="w-5 h-5 text-rose-500" />;
    }
  };

  const getCategoryColor = (category?: string | null) => {
    switch (category?.toLowerCase()) {
      case "anniversary":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30";
      case "birthday":
        return "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/30";
      case "countdown":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30";
      case "other":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30";
      default:
        return "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30";
    }
  };

  // Filter milestones based on active filter
  const filteredMilestones = milestones.filter((milestone) => {
    if (activeFilter === "all") return true;
    return milestone.milestone_type?.toLowerCase() === activeFilter;
  });

  // Sort milestones by date (newest first)
  const sortedMilestones = [...filteredMilestones].sort(
    (a, b) =>
      new Date(b.milestone_date).getTime() -
      new Date(a.milestone_date).getTime(),
  );

  // Calculate pagination
  const totalItems = sortedMilestones.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMilestones = sortedMilestones.slice(startIndex, endIndex);

  // Update filter counts
  const filterOptionsWithCounts = FILTER_OPTIONS.map((option) => ({
    ...option,
    count: option.id === "all" 
      ? milestones.length 
      : milestones.filter((m) => m.milestone_type?.toLowerCase() === option.id).length,
  }));

  // Reset to first page when filter changes
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  // Handle milestone click to open edit dialog
  const handleMilestoneClick = (milestone: Milestone) => {
    // Convert milestone to match EditEventDialog interface
    const editMilestone: EditDialogMilestone = {
      id: milestone.id,
      title: milestone.title,
      description: milestone.description || undefined,
      milestone_date: milestone.milestone_date,
      milestone_type: milestone.milestone_type || "other",
    };
    setSelectedMilestone(editMilestone);
    setIsEditDialogOpen(true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (milestones.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
          <Star className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No milestones yet
        </p>
        <button className="mt-2 text-rose-500 text-sm hover:underline font-medium">
          Create your first milestone
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filter Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by type</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptionsWithCounts.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                    isActive
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                      : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive
                      ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                      : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestones List */}
        {filteredMilestones.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
            <div className="mx-auto w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No {activeFilter === "all" ? "" : activeFilter} milestones found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${getCategoryColor(
                  milestone.milestone_type,
                )}`}
                onClick={() => handleMilestoneClick(milestone)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg mt-1">
                      {getCategoryIcon(milestone.milestone_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {milestone.title}
                      </h3>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {milestone.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(milestone.milestone_date), "MMM d, yyyy")}
                        </span>
                        {milestone.milestone_type && (
                          <span className="px-2 py-0.5 bg-white dark:bg-zinc-800 rounded-full text-xs font-medium capitalize">
                            {milestone.milestone_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMilestoneClick(milestone);
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} milestones
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-rose-500 text-white"
                        : "bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditEventDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />
    </>
  );
}
