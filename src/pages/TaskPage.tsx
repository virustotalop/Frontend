import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { Task, Category, SubTask } from "../types";

export default function TaskPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [categories, setCategories] = useLocalStorage<Category[]>("categories", []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState<number | "all">("all");
  const [filterCompleted, setFilterCompleted] = useState<"all" | "completed" | "incomplete">("all");

  
  const openEditTaskForm = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (data: {
    title: string;
    dueDate: string;
    categoryId: number;
  }) => {
    if (editingTask) {
      setTasks(tasks.map(t => (t.id === editingTask.id ? { ...t, ...data } : t)));
    } else {
      setTasks([...tasks, { id: Date.now(), completed: false, subtasks: [], ...data }]);
    }

    setEditingTask(null);
  };

  //Subtask
  const addSubTask = (taskId: number, title: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: Date.now(), title, completed: false }] } : t
    ));
  };

  const updateSubTask = (taskId: number, subTaskId: number, updates: Partial<SubTask>) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? {
          ...t,
          subtasks: t.subtasks.map(s =>
            s.id === subTaskId ? { ...s, ...updates } : s
          )
        }
        : t
    ))
  };

  const toggleSubTask = (taskId: number, subId: number) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s) }
        : t
    ));
  };

  const removeSubTask = (taskId: number, subId: number) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subId) }
        : t
    ));
  };

  //Category
  const addCategory = (name: string) => setCategories([...categories, { id: Date.now(), name }]);
  const renameCategory = (id: number, name: string) => setCategories(categories.map(c => c.id === id ? { ...c, name } : c));
  const removeCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    setTasks(tasks.map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t));
  };

  const filteredTasks = tasks.filter(task => {
    const categoryMatch = filterCategoryId === "all" || task.categoryId === filterCategoryId;
    const statusMatch =
      filterCompleted === "all" ||
      (filterCompleted === "completed" && task.completed) ||
      (filterCompleted === "incomplete" && !task.completed);
    return categoryMatch && statusMatch;
  });

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* Categories */}
      <h2>Categories</h2>
      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => {
              const newName = prompt("Rename category", c.name);
              if (newName) renameCategory(c.id, newName);
            }}>Edit</button>
            <button onClick={() => removeCategory(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => {
        const name = prompt("Category name");
        if (name) addCategory(name);
      }}>Add Category</button>

      <div style={{ margin: "1rem" }}>
        <label>
          Category:
          <select value={filterCategoryId} onChange={e => setFilterCategoryId(e.target.value === "all" ? "all" : parseInt(e.target.value))}>
            <option value="all">All</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <label style={{ marginLeft: "1rem" }}>
          Status:
          <select value={filterCompleted} onChange={e => setFilterCompleted(e.target.value as any)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </label>
      </div>

      {/* New task form */}
      <TaskForm
        task={editingTask || undefined}
        categories={categories}
        onSubmit={handleFormSubmit}
      />

      <TaskList
        tasks={filteredTasks}
        categories={categories}
        onToggle={id => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
        onRemove={id => setTasks(tasks.filter(t => t.id !== id))}
        onEdit={openEditTaskForm}
        onAddSubTask={(taskId, title) => addSubTask(taskId, title)}
        onToggleSubTask={toggleSubTask}
        onRemoveSubTask={removeSubTask}
        onUpdateSubTask={(taskId, subId, updates) => updateSubTask(taskId, subId, updates)}
      />
    </div>
  );
}
