import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskStatus } from "@/types/task.types";

type TaskStore = {
  tasks: Task[];
  addTask: (title: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (title) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              status: "todo",
              priority: "medium",
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      moveTask: (id: string, status: TaskStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task,
          ),
        })),

      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task,
          ),
        })),
    }),
    {
      name: "task-storage",
    },
  ),
);
