import { Task } from "@/types/task.types";

type Props = {
  task: Task;
};

const priorityConfig = {
  low: {
    label: "Low",
    className: "bg-green-100 text-green-700",
  },
  medium: {
    label: "Medium",
    className: "bg-yellow-100 text-yellow-700",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-700",
  },
};

// export default function TaskCardContent({ task }: Props) {
//   const priority = priorityConfig[task.priority];

//   return (
export default function TaskCardContent({ task }: Props) {
  const priority = priorityConfig[task.priority];

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 leading-5">{task.title}</h3>

        <span
          className={`
            shrink-0
            rounded-full
            px-2.5
            py-1
            text-xs
            font-medium
            ${priority.className}
          `}
        >
          {priority.label}
        </span>
      </div>

      {/* Description */}

      {task.description && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}

      <div className="mt-4 flex items-center justify-between">
        {/* Due date */}

        {task.dueDate ? (
          <div
            className={`
      flex
      items-center
      gap-1.5
      text-xs
      ${isOverdue ? "text-red-500" : "text-gray-500"}
    `}
          >
            <span>📅</span>

            <span>
              {isOverdue ? "Overdue · " : ""}

              {new Date(task.dueDate).toLocaleDateString("uk-UA")}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No deadline</span>
        )}

        {/* Created */}

        <span className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString("uk-UA")}
        </span>
      </div>
    </div>
  );
}
