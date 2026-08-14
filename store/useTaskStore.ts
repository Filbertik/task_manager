import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskStatus } from "@/types/task.types";

type TaskStore = {
  tasks: Task[];

  addTask: (title: string) => void;

  moveTask: (taskId: string, status: TaskStatus, newIndex: number) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

      // addTask: (title) =>
      //   set((state) => ({
      //     tasks: [
      //       ...state.tasks,
      //       {
      //         id: crypto.randomUUID(),
      //         title,
      //         status: "todo",
      //         priority: "medium",
      //         createdAt: new Date().toISOString(),
      //         order: state.tasks.filter((task) => task.status === "todo")
      //           .length,
      //       },
      //     ],
      //   })),
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
              dueDate: undefined,
              order: state.tasks.filter((task) => task.status === "todo")
                .length,
            },
          ],
        })),

      moveTask: (taskId, status, newIndex) =>
        set((state) => {
          const task = state.tasks.find((task) => task.id === taskId);

          if (!task) return state;

          const oldStatus = task.status;

          // Витягуємо таску
          let updatedTasks = state.tasks.filter((task) => task.id !== taskId);

          // Якщо переносимо в іншу колонку
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
            // Переміщення всередині тієї самої колонки
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
