import { Task, TaskStatus } from "@/types/task.types";
import TaskCard from "./TaskCard";

type Props = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
};

export default function Column({ title, status, tasks }: Props) {
  return (
    <div className="bg-gray-100 p-4 rounded-xl w-full">
      <h2 className="font-bold mb-4">{title}</h2>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
