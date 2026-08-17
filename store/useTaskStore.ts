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

      // ========================================
      // CREATE
      // ========================================

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

      // ========================================
      // UPDATE
      // ========================================

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

      // ========================================
      // DELETE
      // ========================================

      deleteTask: (id) =>
        set((state) => {
          const deletedTask = state.tasks.find((task) => task.id === id);

          if (!deletedTask) {
            return state;
          }

          const remainingTasks = state.tasks.filter((task) => task.id !== id);

          // Recalculate order separately
          // for every column.

          const statuses: TaskStatus[] = ["todo", "in-progress", "done"];

          const updatedTasks = statuses.flatMap((status) => {
            return remainingTasks
              .filter((task) => task.status === status)
              .sort((a, b) => a.order - b.order)
              .map((task, index) => ({
                ...task,
                order: index,
              }));
          });

          return {
            tasks: updatedTasks,
          };
        }),

      // ========================================
      // MOVE / SORT
      // ========================================

      moveTask: (taskId, newStatus, newIndex) =>
        set((state) => {
          const task = state.tasks.find((task) => task.id === taskId);

          if (!task) {
            return state;
          }

          const oldStatus = task.status;

          // Remove dragged task
          const withoutDraggedTask = state.tasks.filter(
            (task) => task.id !== taskId,
          );

          // ====================================
          // MOVE BETWEEN COLUMNS
          // ====================================

          if (oldStatus !== newStatus) {
            const targetTasks = withoutDraggedTask
              .filter((task) => task.status === newStatus)
              .sort((a, b) => a.order - b.order);

            const movedTask: Task = {
              ...task,
              status: newStatus,
            };

            targetTasks.splice(newIndex, 0, movedTask);

            // Recalculate order
            const updatedTargetTasks = targetTasks.map((task, index) => ({
              ...task,
              order: index,
            }));

            const otherTasks = withoutDraggedTask.filter(
              (task) => task.status !== newStatus,
            );

            return {
              tasks: [...otherTasks, ...updatedTargetTasks],
            };
          }

          // ====================================
          // SORT INSIDE SAME COLUMN
          // ====================================

          const columnTasks = withoutDraggedTask
            .filter((task) => task.status === newStatus)
            .sort((a, b) => a.order - b.order);

          const movedTask: Task = {
            ...task,
            status: newStatus,
          };

          columnTasks.splice(newIndex, 0, movedTask);

          const updatedColumnTasks = columnTasks.map((task, index) => ({
            ...task,
            order: index,
          }));

          const otherTasks = withoutDraggedTask.filter(
            (task) => task.status !== newStatus,
          );

          return {
            tasks: [...otherTasks, ...updatedColumnTasks],
          };
        }),
    }),

    {
      name: "task-storage",
    },
  ),
);
