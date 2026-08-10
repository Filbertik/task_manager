import { Task } from "@/types/task.types";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <p className="font-medium">{task.title}</p>
      <span className="text-xs text-gray-500">{task.priority}</span>
    </div>
  );
}
