"use client";

import { Task } from "@/types/task.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white
        p-3
        rounded-lg
        shadow
        cursor-grab
        select-none
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <p className="font-medium">{task.title}</p>

      <span className="text-xs text-gray-500">{task.priority}</span>
    </div>
  );
}
