"use client";

import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Task, TaskStatus } from "@/types/task.types";

import TaskCard from "./TaskCard";

type Props = {
  title: string;

  status: TaskStatus;

  tasks: Task[];

  onEditTask?: (taskId: string) => void;
};

export default function Column({ title, status, tasks, onEditTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div
      className="
        flex
        min-h-[500px]
        flex-col
        rounded-2xl
        bg-gray-100
        p-4

        dark:bg-gray-900
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="
            font-semibold
            text-gray-900
            dark:text-gray-100
          "
        >
          {title}
        </h2>

        <span
          className="
            flex
            h-6
            min-w-6
            items-center
            justify-center
            rounded-full
            bg-gray-200
            px-2
            text-xs
            font-medium
            text-gray-600

            dark:bg-gray-800
            dark:text-gray-400
          "
        >
          {tasks.length}
        </span>
      </div>

      {/* DROP AREA */}

      <div
        ref={setNodeRef}
        className={`
          min-h-[430px]
          flex-1
          space-y-3
          rounded-xl
          p-1
          transition

          ${isOver ? "bg-gray-200 dark:bg-gray-800" : ""}
        `}
      >
        <SortableContext
          items={sortedTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask?.(task.id)}
            />
          ))}
        </SortableContext>

        {/* EMPTY */}

        {sortedTasks.length === 0 && (
          <div
            className="
                flex
                min-h-[120px]
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-gray-300
                text-sm
                text-gray-400

                dark:border-gray-700
                dark:text-gray-500
              "
          >
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
