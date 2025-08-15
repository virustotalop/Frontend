import TaskItem from "./TaskItem";
import { Task, Category } from "../types";

export interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (task: Task) => void;
  onAddSubTask: (taskId: number, title: string, description: string) => void;
  onToggleSubTask: (taskId: number, subId: number) => void;
  onRemoveSubTask: (taskId: number, subId: number) => void;
  onUpdateSubTask: (taskId: number, subId: number, updates: { title?: string; description?: string }) => void;
}

export default function TaskList({
  tasks,
  categories,
  onToggle,
  onRemove,
  onEdit,
  onAddSubTask,
  onToggleSubTask,
  onRemoveSubTask,
  onUpdateSubTask
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks yet</p>;
  }

  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          category={categories.find(c => c.id === task.categoryId)}
          onToggle={() => onToggle(task.id)}
          onRemove={() => onRemove(task.id)}
          onEdit={() => onEdit(task)}
          onAddSubTask={(title, description) => onAddSubTask(task.id, title, description)}
          onToggleSubTask={(subId) => onToggleSubTask(task.id, subId)}
          onRemoveSubTask={(subId) => onRemoveSubTask(task.id, subId)}
          onUpdateSubTask={(subId, updates) => onUpdateSubTask(task.id, subId, updates)}
        />
      ))}
    </ul>
  );
}
