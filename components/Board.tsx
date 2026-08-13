"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";

// import {
//   DndContext,
//   DragEndEvent,
//   DragOverEvent,
//   closestCorners,
// } from "@dnd-kit/core";

import { useState } from "react";

import { useTaskStore } from "@/store/useTaskStore";
import { TaskStatus } from "@/types/task.types";

import Column from "./Column";

export default function Board() {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const { tasks, addTask, moveTask } = useTaskStore();

  const [title, setTitle] = useState("");

  const todo = tasks.filter((task) => task.status === "todo");

  const inProgress = tasks.filter((task) => task.status === "in-progress");

  const done = tasks.filter((task) => task.status === "done");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;

    const activeTask = tasks.find((task) => task.id === taskId);

    if (!activeTask) return;

    let newStatus: TaskStatus;
    let newIndex: number;

    // Якщо кинули на колонку
    if (over.id === "todo" || over.id === "in-progress" || over.id === "done") {
      newStatus = over.id as TaskStatus;

      const columnTasks = tasks
        .filter((task) => task.status === newStatus)
        .sort((a, b) => a.order - b.order);

      newIndex = columnTasks.length;
    } else {
      // Якщо кинули на іншу таску
      const overTask = tasks.find((task) => task.id === over.id);

      if (!overTask) return;

      newStatus = overTask.status;

      const columnTasks = tasks
        .filter((task) => task.status === newStatus && task.id !== taskId)
        .sort((a, b) => a.order - b.order);

      newIndex = columnTasks.findIndex((task) => task.id === overTask.id);

      if (newIndex === -1) {
        newIndex = columnTasks.length;
      }
    }
    const handleDragStart = (event: DragStartEvent) => {
      setActiveTaskId(event.active.id as string);
    };

    moveTask(taskId, newStatus, newIndex);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Add task */}
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="border p-2 rounded w-64"
            placeholder="New task..."
          />

          <button
            onClick={() => {
              if (!title.trim()) return;

              addTask(title.trim());
              setTitle("");
            }}
            className="bg-black text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-4">
          <Column title="Todo" status="todo" tasks={todo} />

          <Column title="In Progress" status="in-progress" tasks={inProgress} />

          <Column title="Done" status="done" tasks={done} />
        </div>
      </div>
    </DndContext>
  );
}
