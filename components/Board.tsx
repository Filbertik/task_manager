"use client";

import { useMemo, useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";

import { useTaskStore } from "@/store/useTaskStore";

import { TaskPriority, TaskStatus } from "@/types/task.types";

import Column from "./Column";

import TaskCardContent from "./TaskCardContent";

import TaskModal, { TaskFormData } from "./TaskModal";

import TaskFilters, { SortOption, StatusFilter } from "./TaskFilters";

export default function Board() {
  // ======================================
  // STORE
  // ======================================

  const {
    tasks,

    addTask,

    updateTask,

    deleteTask,

    moveTask,
  } = useTaskStore();

  // ======================================
  // DRAG STATE
  // ======================================

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // ======================================
  // MODAL STATE
  // ======================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // ======================================
  // FILTER STATE
  // ======================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all",
  );

  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // ======================================
  // ACTIVE TASK
  // ======================================

  const activeTask = tasks.find((task) => task.id === activeTaskId);

  // ======================================
  // EDITING TASK
  // ======================================

  const editingTask = tasks.find((task) => task.id === editingTaskId);

  // ======================================
  // FILTER + SORT
  // ======================================

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // ================================
    // SEARCH
    // ================================

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((task) => {
        const title = task.title.toLowerCase();

        const description = (task.description ?? "").toLowerCase();

        return title.includes(searchValue) || description.includes(searchValue);
      });
    }

    // ================================
    // STATUS
    // ================================

    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // ================================
    // PRIORITY
    // ================================

    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // ================================
    // SORT
    // ================================

    const priorityOrder = {
      low: 1,
      medium: 2,
      high: 3,
    };

    result.sort((a, b) => {
      switch (sortOption) {
        // --------------------------
        // NEWEST
        // --------------------------

        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // --------------------------
        // OLDEST
        // --------------------------

        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        // --------------------------
        // HIGH → LOW
        // --------------------------

        case "priority-high":
          return priorityOrder[b.priority] - priorityOrder[a.priority];

        // --------------------------
        // LOW → HIGH
        // --------------------------

        case "priority-low":
          return priorityOrder[a.priority] - priorityOrder[b.priority];

        // --------------------------
        // DUE DATE
        // --------------------------

        case "due-date": {
          if (!a.dueDate && !b.dueDate) {
            return 0;
          }

          if (!a.dueDate) {
            return 1;
          }

          if (!b.dueDate) {
            return -1;
          }

          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        default:
          return 0;
      }
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortOption]);

  // ======================================
  // COLUMNS
  // ======================================

  const todo = filteredTasks.filter((task) => task.status === "todo");

  const inProgress = filteredTasks.filter(
    (task) => task.status === "in-progress",
  );

  const done = filteredTasks.filter((task) => task.status === "done");

  // ======================================
  // CREATE
  // ======================================

  const handleCreateTask = () => {
    setEditingTaskId(null);

    setIsModalOpen(true);
  };

  // ======================================
  // EDIT
  // ======================================

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);

    setIsModalOpen(true);
  };

  // ======================================
  // CLOSE MODAL
  // ======================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setEditingTaskId(null);
  };

  // ======================================
  // SUBMIT MODAL
  // ======================================

  const handleModalSubmit = (data: TaskFormData) => {
    if (editingTaskId) {
      updateTask(editingTaskId, data);
    } else {
      addTask(data);
    }

    setIsModalOpen(false);

    setEditingTaskId(null);
  };

  // ======================================
  // DELETE
  // ======================================

  const handleDeleteTask = () => {
    if (!editingTaskId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    deleteTask(editingTaskId);

    setIsModalOpen(false);

    setEditingTaskId(null);
  };

  // ======================================
  // DRAG START
  // ======================================

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  // ======================================
  // DRAG END
  // ======================================

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTaskId(null);

    if (!over) {
      return;
    }

    const taskId = active.id as string;

    const draggedTask = tasks.find((task) => task.id === taskId);

    if (!draggedTask) {
      return;
    }

    // ==================================
    // DROP ON COLUMN
    // ==================================

    const columnIds: TaskStatus[] = ["todo", "in-progress", "done"];

    if (columnIds.includes(over.id as TaskStatus)) {
      const newStatus = over.id as TaskStatus;

      const columnTasks = tasks
        .filter((task) => task.status === newStatus && task.id !== taskId)
        .sort((a, b) => a.order - b.order);

      moveTask(taskId, newStatus, columnTasks.length);

      return;
    }

    // ==================================
    // DROP ON TASK
    // ==================================

    const overTask = tasks.find((task) => task.id === over.id);

    if (!overTask) {
      return;
    }

    const newStatus = overTask.status;

    const columnTasks = tasks
      .filter((task) => task.status === newStatus && task.id !== taskId)
      .sort((a, b) => a.order - b.order);

    const newIndex = columnTasks.findIndex((task) => task.id === overTask.id);

    moveTask(
      taskId,
      newStatus,
      newIndex === -1 ? columnTasks.length : newIndex,
    );
  };

  // ======================================
  // RESET FILTERS
  // ======================================

  const handleResetFilters = () => {
    setSearch("");

    setStatusFilter("all");

    setPriorityFilter("all");

    setSortOption("newest");
  };

  const hasFilters =
    search !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sortOption !== "newest";

  // ======================================
  // RENDER
  // ======================================

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="
          space-y-6
        "
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-gray-900
              "
            >
              Task Manager
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Manage your tasks with Kanban
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateTask}
            className="
              w-full
              rounded-lg
              bg-black
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-gray-800
              sm:w-auto
            "
          >
            + Add task
          </button>
        </div>

        {/* ================================= */}
        {/* FILTERS */}
        {/* ================================= */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-4
          "
        >
          <TaskFilters
            search={search}
            status={statusFilter}
            priority={priorityFilter}
            sort={sortOption}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onSortChange={setSortOption}
          />

          {/* =============================== */}
          {/* FILTER INFO */}
          {/* =============================== */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              border-t
              border-gray-100
              pt-4
            "
          >
            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Showing{" "}
              <span
                className="
                  font-medium
                  text-gray-900
                "
              >
                {filteredTasks.length}
              </span>{" "}
              of{" "}
              <span
                className="
                  font-medium
                  text-gray-900
                "
              >
                {tasks.length}
              </span>{" "}
              tasks
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="
                  text-sm
                  font-medium
                  text-gray-500
                  transition
                  hover:text-black
                "
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* NO RESULTS */}
        {/* ================================= */}

        {filteredTasks.length === 0 && tasks.length > 0 && (
          <div
            className="
                rounded-xl
                border
                border-dashed
                border-gray-300
                bg-white
                py-16
                text-center
              "
          >
            <div
              className="
                  text-4xl
                "
            >
              🔍
            </div>

            <h3
              className="
                  mt-4
                  font-semibold
                  text-gray-900
                "
            >
              No tasks found
            </h3>

            <p
              className="
                  mt-1
                  text-sm
                  text-gray-500
                "
            >
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="
                  mt-4
                  rounded-lg
                  bg-black
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                "
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ================================= */}
        {/* BOARD */}
        {/* ================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            lg:grid-cols-3
          "
        >
          <Column
            title="Todo"
            status="todo"
            tasks={todo}
            onEditTask={handleEditTask}
          />

          <Column
            title="In Progress"
            status="in-progress"
            tasks={inProgress}
            onEditTask={handleEditTask}
          />

          <Column
            title="Done"
            status="done"
            tasks={done}
            onEditTask={handleEditTask}
          />
        </div>
      </div>

      {/* ================================= */}
      {/* DRAG OVERLAY */}
      {/* ================================= */}

      <DragOverlay>
        {activeTask ? <TaskCardContent task={activeTask} /> : null}
      </DragOverlay>

      {/* ================================= */}
      {/* MODAL */}
      {/* ================================= */}

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask ?? null}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        onDelete={editingTaskId ? handleDeleteTask : undefined}
      />
    </DndContext>
  );
}
