import { useState } from 'react';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (title: string) => {
    setTasks([...tasks, { id: Date.now(), title, completed: false }]);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return { tasks, addTask, toggleTask };
}