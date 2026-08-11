"use client";

import { useDroppable } from "@dnd-kit/core";
import { Task, TaskStatus } from "@/types/task.types";
import TaskCard from "./TaskCard";

type Props = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
};

export default function Column({ title, status, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full
        min-h-[400px]
        p-4
        rounded-xl
        transition-colors
        ${isOver ? "bg-gray-200" : "bg-gray-100"}
      `}
    >
      <h2 className="font-bold mb-4">{title}</h2>

      <div className="flex flex-col gap-3">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
