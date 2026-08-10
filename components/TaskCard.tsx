"use client";

import { Task } from "@/types/task.types";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-3 rounded-lg shadow cursor-grab"
    >
      <p className="font-medium">{task.title}</p>
      <span className="text-xs text-gray-500">{task.priority}</span>
    </div>
  );
}
