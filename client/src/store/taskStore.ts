import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

interface TaskStore {
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete Q1 Report",
    description: "Finish the quarterly performance report",
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: "high",
  },
  {
    id: "2",
    title: "Review Team PRs",
    description: "Review pending pull requests from team members",
    completed: true,
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: "medium",
  },
  {
    id: "3",
    title: "Update Documentation",
    description: "Update API documentation with new endpoints",
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    priority: "medium",
  },
  {
    id: "4",
    title: "Prepare Presentation",
    description: "Create slides for Monday's client meeting",
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    priority: "high",
  },
  {
    id: "5",
    title: "Code Review Session",
    description: "Participate in weekly code review",
    completed: true,
    dueDate: new Date(Date.now()).toISOString(),
    priority: "low",
  },
];

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: mockTasks,
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: Date.now().toString() }],
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));
