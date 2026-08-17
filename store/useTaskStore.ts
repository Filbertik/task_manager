import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskPriority, TaskStatus } from "@/types/task.types";

type CreateTaskData = {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
};

type UpdateTaskData = CreateTaskData;

type TaskStore = {
  tasks: Task[];

  addTask: (data: CreateTaskData) => void;

  updateTask: (id: string, data: UpdateTaskData) => void;

  deleteTask: (id: string) => void;

  moveTask: (taskId: string, status: TaskStatus, newIndex: number) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

      // =========================
      // CREATE
      // =========================

      addTask: (data) =>
        set((state) => {
          const todoTasks = state.tasks.filter(
            (task) => task.status === "todo",
          );

          const newTask: Task = {
            id: crypto.randomUUID(),
            title: data.title,
            description: data.description,
            priority: data.priority,
            dueDate: data.dueDate,
            status: "todo",
            createdAt: new Date().toISOString(),
            order: todoTasks.length,
          };

          return {
            tasks: [...state.tasks, newTask],
          };
        }),

      // =========================
      // UPDATE
      // =========================

      updateTask: (id, data) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  title: data.title,
                  description: data.description,
                  priority: data.priority,
                  dueDate: data.dueDate,
                }
              : task,
          ),
        })),

      // =========================
      // DELETE
      // =========================

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks
            .filter((task) => task.id !== id)
            .map((task, index) => ({
              ...task,
              order: index,
            })),
        })),

      // =========================
      // MOVE / SORT
      // =========================

      moveTask: (taskId, status, newIndex) =>
        set((state) => {
          const task = state.tasks.find((task) => task.id === taskId);

          if (!task) return state;

          const oldStatus = task.status;

          let updatedTasks = state.tasks.filter((task) => task.id !== taskId);

          if (oldStatus !== status) {
            const targetTasks = updatedTasks
              .filter((task) => task.status === status)
              .sort((a, b) => a.order - b.order);

            targetTasks.splice(newIndex, 0, {
              ...task,
              status,
            });

            targetTasks.forEach((task, index) => {
              task.order = index;
            });

            updatedTasks = updatedTasks.filter(
              (task) => task.status !== status,
            );

            updatedTasks = [...updatedTasks, ...targetTasks];
          } else {
            const columnTasks = updatedTasks
              .filter((task) => task.status === status)
              .sort((a, b) => a.order - b.order);

            columnTasks.splice(newIndex, 0, {
              ...task,
              status,
            });

            columnTasks.forEach((task, index) => {
              task.order = index;
            });

            updatedTasks = updatedTasks.filter(
              (task) => task.status !== status,
            );

            updatedTasks = [...updatedTasks, ...columnTasks];
          }

          return {
            tasks: updatedTasks,
          };
        }),
    }),
    {
      name: "task-storage",
    },
  ),
);
