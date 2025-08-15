import React, { useState, useEffect } from "react";
import { Task, Category } from "../types";
import { stripTime } from "../utils/date";

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSubmit: (data: {
    title: string;
    description: string;
    dueDate: string;
    categoryId: number;
  }) => void;
}

export default function TaskForm({ task, categories, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [categoryId, setCategoryId] = useState(task?.categoryId || (categories[0]?.id ?? 0));
  const [error, setError] = useState("");

  useEffect(() => {
    setDescription(task?.description || "");
    setDueDate(task?.dueDate || "");
    setCategoryId(task?.categoryId || (categories[0]?.id ?? 0));
  }, [task, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    if (!description.trim()) {
      setError("Task description is required");
      return;
    }

    if (description.length > 100) {
        setError("The task description has a maximum length of 100 character");
    }

    if (!dueDate) {
      setError("Task due date is required");
      return;
    }

    const today = stripTime(new Date());

    // Parse the date as local (avoid UTC shift)
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
    onSubmit({ title, description, dueDate, categoryId });
    setTitle("");
    setDescription("");
    setDueDate("");
    setCategoryId(categories[0]?.id ?? 0);
  };

  return (
    <form role="form" onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div>
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
