"use client";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { Task } from "@/types/task.types";

import TaskCardContent from "./TaskCardContent";

type Props = {
  task: Task;

  onEdit?: () => void;
};

export default function TaskCard({ task, onEdit }: Props) {
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
        select-none
        cursor-grab
        touch-none
        transition-opacity

        ${isDragging ? "opacity-30" : "opacity-100"}
      `}
    >
      <TaskCardContent task={task} onEdit={onEdit} />
    </div>
  );
}
