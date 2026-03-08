"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Filter, SortAsc } from "lucide-react";

export function QAFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sortBy") || "date_desc";
  const currentFilter = searchParams.get("filter") || "all";

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", value);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 my-8 p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-rose-100/50 shadow-sm",
        isPending && "opacity-60 pointer-events-none",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm mr-2">
          <Filter size={16} />
          <span>Filter:</span>
        </div>
        {[
          { label: "All Q&A", value: "all" },
          { label: "Completed", value: "completed" },
          { label: "Pending", value: "pending" },
          { label: "Drafts", value: "draft" },
        ].map((f) => (
          <Badge
            key={f.value}
            variant="outline"
            onClick={() => handleFilterChange(f.value)}
            className={cn(
              "cursor-pointer px-3 py-1 text-xs border transition-all",
              currentFilter === f.value
                ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200"
                : "bg-white/80 text-rose-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50",
            )}
          >
            {f.label}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
          <SortAsc size={16} />
          <span>Sort:</span>
        </div>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px] h-9 rounded-xl border-rose-100 bg-white/80 text-rose-900 focus:ring-rose-400">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-rose-100">
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
