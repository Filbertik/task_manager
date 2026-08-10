"use client";

import { Task, TaskStatus } from "@/types/task.types";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
};

export default function Column({ title, status, tasks }: Props) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-xl w-full min-h-[400px]"
    >
      <h2 className="font-bold mb-4">{title}</h2>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
