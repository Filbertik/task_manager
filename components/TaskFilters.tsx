"use client";

import { TaskPriority } from "@/types/task.types";

export type StatusFilter = "all" | "todo" | "in-progress" | "done";

export type SortOption =
  | "newest"
  | "oldest"
  | "priority-high"
  | "priority-low"
  | "due-date";

type Props = {
  search: string;
  status: StatusFilter;
  priority: TaskPriority | "all";
  sort: SortOption;

  onSearchChange: (value: string) => void;

  onStatusChange: (value: StatusFilter) => void;

  onPriorityChange: (value: TaskPriority | "all") => void;

  onSortChange: (value: SortOption) => void;
};

const statuses: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
];

const priorities: {
  value: TaskPriority | "all";
  label: string;
}[] = [
  {
    value: "all",
    label: "All priorities",
  },
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];

export default function TaskFilters({
  search,
  status,
  priority,
  sort,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: Props) {
  return (
    <div className="space-y-4">
      {/* ================================= */}
      {/* SEARCH + SELECTS */}
      {/* ================================= */}

      <div
        className="
          flex
          flex-col
          gap-3
          lg:flex-row
        "
      >
        {/* SEARCH */}

        <div className="relative flex-1">
          <span
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          >
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks..."
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              py-2.5
              pl-10
              pr-4
              text-sm
              outline-none
              transition
              focus:border-black
              focus:ring-1
              focus:ring-black
            "
          />
        </div>

        {/* PRIORITY */}

        <select
          value={priority}
          onChange={(event) =>
            onPriorityChange(event.target.value as TaskPriority | "all")
          }
          className="
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-2.5
            text-sm
            text-gray-700
            outline-none
            transition
            focus:border-black
          "
        >
          {priorities.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {/* SORT */}

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-2.5
            text-sm
            text-gray-700
            outline-none
            transition
            focus:border-black
          "
        >
          <option value="newest">Newest</option>

          <option value="oldest">Oldest</option>

          <option value="priority-high">Priority: High → Low</option>

          <option value="priority-low">Priority: Low → High</option>

          <option value="due-date">Due date</option>
        </select>
      </div>

      {/* ================================= */}
      {/* STATUS FILTER */}
      {/* ================================= */}

      <div
        className="
          flex
          flex-wrap
          gap-2
        "
      >
        {statuses.map((item) => {
          const isActive = status === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onStatusChange(item.value)}
              className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition

                  ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
