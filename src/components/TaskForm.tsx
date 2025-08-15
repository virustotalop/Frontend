import React, { useState, useEffect } from "react";
import { Task, Category } from "../types";
import { stripTime } from "../utils/date";

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSubmit: (data: {
    title: string;
    dueDate: string;
    categoryId: number;
  }) => void;
}

export default function TaskForm({ task, categories, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [categoryId, setCategoryId] = useState(task?.categoryId || (categories[0]?.id ?? 0));
  const [error, setError] = useState("");

  useEffect(() => {
    setDueDate(task?.dueDate || "");
    setCategoryId(task?.categoryId || (categories[0]?.id ?? 0));
  }, [task, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (title.length > 100) {
        setError("The task title has a maximum length of 100 characters");
        return;
    }

    if (!dueDate) {
      setError("Task due date is required");
      return;
    }

    const today = stripTime(new Date());

    // Parse the date as local (avoid UTC shift)
    // If we don't do this then the local date picker doesn't line up with the current time
    const [year, month, day] = dueDate.split("-").map(Number);
    const selectedDate = stripTime(new Date(year, month - 1, day));

    if (selectedDate < today) {
      setError("Task due date cannot be in the past");
      return;
    }

    if (!categoryId) {
      setError("Task category is required");
      return;
    }

    setError("");
    onSubmit({ title, dueDate, categoryId });
    setTitle("");
    setDueDate("");
    setCategoryId(categories[0]?.id ?? 0);
  };

  return (
    <form role="form" onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1rem"}}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem"}}>
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem"}}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={e => setCategoryId(parseInt(e.target.value))}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button type="submit">{task ? "Update Task" : "Add Task"}</button>
    </form>
  );
}
