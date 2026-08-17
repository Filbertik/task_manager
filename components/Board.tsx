"use client";

import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";

import { useTaskStore } from "@/store/useTaskStore";

import { TaskStatus } from "@/types/task.types";

import Column from "./Column";

import TaskCardContent from "./TaskCardContent";

import TaskModal, { TaskFormData } from "./TaskModal";

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
  // ACTIVE TASK
  // ======================================

  const activeTask = tasks.find((task) => task.id === activeTaskId);

  // ======================================
  // EDITING TASK
  // ======================================

  const editingTask = tasks.find((task) => task.id === editingTaskId);

  // ======================================
  // COLUMNS
  // ======================================

  const todo = tasks
    .filter((task) => task.status === "todo")
    .sort((a, b) => a.order - b.order);

  const inProgress = tasks
    .filter((task) => task.status === "in-progress")
    .sort((a, b) => a.order - b.order);

  const done = tasks
    .filter((task) => task.status === "done")
    .sort((a, b) => a.order - b.order);

  // ======================================
  // CREATE TASK
  // ======================================

  const handleCreateTask = () => {
    setEditingTaskId(null);

    setIsModalOpen(true);
  };

  // ======================================
  // EDIT TASK
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
  // MODAL SUBMIT
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
  // DELETE TASK
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
        {/* TOP BAR */}
        {/* ================================= */}

        <div
          className="
            flex
            items-center
            justify-between
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
              rounded-lg
              bg-black
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-gray-800
            "
          >
            + Add task
          </button>
        </div>

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
      {/* TASK MODAL */}
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
