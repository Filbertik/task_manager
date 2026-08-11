export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  order: number;
};

// export type TaskStatus = "todo" | "in-progress" | "done";

// export type Task = {
//   id: string;
//   title: string;
//   description?: string;
//   status: TaskStatus;
//   priority: "low" | "medium" | "high";
//   createdAt: string;
//   moveTask: (id: string, status: TaskStatus) => void;
// };
