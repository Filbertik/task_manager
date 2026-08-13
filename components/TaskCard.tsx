"use client";

import { Task } from "@/types/task.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCardContent from "./TaskCardContent";

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
        cursor-grab
        select-none
        ${isDragging ? "opacity-30" : ""}
      `}
    >
      <TaskCardContent task={task} />
    </div>
  );
}
