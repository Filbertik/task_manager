"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Task, TaskPriority } from "@/types/task.types";

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Введіть назву задачі")
    .max(100, "Назва не повинна перевищувати 100 символів"),

  description: z
    .string()
    .max(500, "Опис не повинен перевищувати 500 символів")
    .optional(),

  priority: z.enum(["low", "medium", "high"]),

  dueDate: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

type Props = {
  isOpen: boolean;

  task?: Task | null;

  onClose: () => void;

  onSubmit: (data: TaskFormData) => void;

  onDelete?: () => void;
};

const priorities: {
  value: TaskPriority;
  label: string;
}[] = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];

export default function TaskModal({
  isOpen,
  task,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const isEditMode = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),

    defaultValues: {
      title: "",

      description: "",

      priority: "medium",

      dueDate: "",
    },
  });

  const selectedPriority = watch("priority");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (task) {
      reset({
        title: task.title,

        description: task.description ?? "",

        priority: task.priority,

        dueDate: task.dueDate ?? "",
      });

      return;
    }

    reset({
      title: "",

      description: "",

      priority: "medium",

      dueDate: "",
    });
  }, [task, isOpen, reset]);

  if (!isOpen) {
    return null;
  }

  const submitHandler = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4

        dark:bg-black/70
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-[520px]
          rounded-2xl
          border
          border-transparent
          bg-white
          shadow-2xl

          dark:border-gray-800
          dark:bg-gray-900
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-6
            py-5

            dark:border-gray-800
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              text-gray-900

              dark:text-gray-100
            "
          >
            {isEditMode ? "Edit task" : "Create task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-xl
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900

              dark:text-gray-400
              dark:hover:bg-gray-800
              dark:hover:text-gray-100
            "
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="
            space-y-5
            p-6
          "
        >
          {/* TITLE */}

          <div>
            <label
              htmlFor="title"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700

                dark:text-gray-300
              "
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              {...register("title")}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-black
                focus:ring-1
                focus:ring-black

                dark:border-gray-700
                dark:bg-gray-950
                dark:text-gray-100
                dark:placeholder:text-gray-500
                dark:focus:border-white
                dark:focus:ring-white
              "
            />

            {errors.title && (
              <p
                className="
                  mt-1
                  text-xs
                  text-red-500
                "
              >
                {errors.title.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="description"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700

                dark:text-gray-300
              "
            >
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              placeholder="Enter task description"
              {...register("description")}
              className="
                w-full
                resize-none
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-black
                focus:ring-1
                focus:ring-black

                dark:border-gray-700
                dark:bg-gray-950
                dark:text-gray-100
                dark:placeholder:text-gray-500
                dark:focus:border-white
                dark:focus:ring-white
              "
            />

            {errors.description && (
              <p
                className="
                  mt-1
                  text-xs
                  text-red-500
                "
              >
                {errors.description.message}
              </p>
            )}
          </div>

          {/* PRIORITY */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700

                dark:text-gray-300
              "
            >
              Priority
            </label>

            <div
              className="
                grid
                grid-cols-3
                gap-2
              "
            >
              {priorities.map((priority) => {
                const isSelected = selectedPriority === priority.value;

                return (
                  <label
                    key={priority.value}
                    className={`
                        cursor-pointer
                        rounded-lg
                        border
                        px-3
                        py-2.5
                        text-center
                        text-sm
                        font-medium
                        transition

                        ${
                          isSelected
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-gray-900"
                            : "border-gray-300 text-gray-600 hover:border-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500"
                        }
                      `}
                  >
                    <input
                      type="radio"
                      value={priority.value}
                      {...register("priority")}
                      className="sr-only"
                    />

                    {priority.label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* DUE DATE */}

          <div>
            <label
              htmlFor="dueDate"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700

                dark:text-gray-300
              "
            >
              Due date
            </label>

            <input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-black
                focus:ring-1
                focus:ring-black

                dark:border-gray-700
                dark:bg-gray-950
                dark:text-gray-100
                dark:focus:border-white
                dark:focus:ring-white
              "
            />
          </div>

          {/* FOOTER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-gray-200
              pt-5

              dark:border-gray-800
            "
          >
            {/* DELETE */}

            <div>
              {isEditMode && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="
                      rounded-lg
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-red-500
                      transition
                      hover:bg-red-50

                      dark:hover:bg-red-500/10
                    "
                >
                  Delete
                </button>
              )}
            </div>

            {/* ACTIONS */}

            <div
              className="
                flex
                gap-2
              "
            >
              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50

                  dark:border-gray-700
                  dark:text-gray-300
                  dark:hover:bg-gray-800
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  rounded-lg
                  bg-black
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-gray-800

                  dark:bg-white
                  dark:text-gray-900
                  dark:hover:bg-gray-200
                "
              >
                {isEditMode ? "Save changes" : "Create task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
