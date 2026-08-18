import { Task } from "@/types/task.types";

type Props = {
  task: Task;

  onEdit?: () => void;
};

const priorityConfig = {
  low: {
    label: "Low",

    className:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  },

  medium: {
    label: "Medium",

    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  },

  high: {
    label: "High",

    className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
};

export default function TaskCardContent({ task, onEdit }: Props) {
  const priority = priorityConfig[task.priority];

  const isOverdue = Boolean(
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done",
  );

  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md

        dark:border-gray-700
        dark:bg-gray-900
        dark:shadow-black/20
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <h3
          className="
            min-w-0
            flex-1
            font-semibold
            leading-5
            text-gray-900

            dark:text-gray-100
          "
        >
          {task.title}
        </h3>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          <span
            className={`
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

          {onEdit && (
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();

                onEdit();
              }}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                text-lg
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-900

                dark:text-gray-500
                dark:hover:bg-gray-800
                dark:hover:text-gray-100
              "
              aria-label="Edit task"
            >
              ⋯
            </button>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}

      {task.description && (
        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            text-gray-500

            dark:text-gray-400
          "
        >
          {task.description}
        </p>
      )}

      {/* FOOTER */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-2
        "
      >
        {/* DUE DATE */}

        {task.dueDate ? (
          <div
            className={`
              flex
              items-center
              gap-1.5
              text-xs

              ${isOverdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"}
            `}
          >
            <span>📅</span>

            <span>
              {isOverdue && "Overdue · "}

              {new Date(task.dueDate).toLocaleDateString("uk-UA")}
            </span>
          </div>
        ) : (
          <span
            className="
              text-xs
              text-gray-400

              dark:text-gray-500
            "
          >
            No deadline
          </span>
        )}

        {/* CREATED */}

        <span
          className="
            text-xs
            text-gray-400

            dark:text-gray-500
          "
        >
          {new Date(task.createdAt).toLocaleDateString("uk-UA")}
        </span>
      </div>
    </div>
  );
}
