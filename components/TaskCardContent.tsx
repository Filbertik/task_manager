import { Task } from "@/types/task.types";

type Props = {
  task: Task;
};

export default function TaskCardContent({ task }: Props) {
  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <p className="font-medium">{task.title}</p>

      <span className="text-xs text-gray-500">{task.priority}</span>
    </div>
  );
}
