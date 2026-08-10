"use client";

import { useTaskStore } from "@/store/useTaskStore";
import Column from "./Column";
import { useState } from "react";

export default function Board() {
  const { tasks, addTask } = useTaskStore();
  const [title, setTitle] = useState("");

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="space-y-6">
      {/* add task */}
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-64"
          placeholder="New task..."
        />
        <button
          onClick={() => {
            addTask(title);
            setTitle("");
          }}
          className="bg-black text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* columns */}
      <div className="grid grid-cols-3 gap-4">
        <Column title="Todo" status="todo" tasks={todo} />
        <Column title="In Progress" status="in-progress" tasks={inProgress} />
        <Column title="Done" status="done" tasks={done} />
      </div>
    </div>
  );
}
