export type SubTask = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export type Category = {
  id: number
  name: string;
}

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate?: string;
  completed: boolean;
  subtasks: SubTask[];
  categoryId?: number;
  };