import { useState } from "react";
import { Task, Category, SubTask } from "../types";

interface TaskItemProps {
  task: Task;
  category?: Category;
  onToggle: () => void;
  onRemove: () => void;
  onEdit: (task: Task) => void;
  onAddSubTask: (title: string, description: string) => void;
  onToggleSubTask: (id: number) => void;
  onRemoveSubTask: (id: number) => void;
  onUpdateSubTask: (subTaskId: number, updates: { title?: string; description?: string }) => void;
}

export default function TaskItem({
  task,
  category,
  onToggle,
  onRemove,
  onEdit,
  onAddSubTask,
  onToggleSubTask,
  onRemoveSubTask,
  onUpdateSubTask
}: TaskItemProps) {
  const [editingSubTaskId, setEditingSubTaskId] = useState<number | null>(null);
  const [subTaskTitle, setSubTaskTitle] = useState("");
  const [subTaskDescription, setSubTaskDescription] = useState("");

  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [newSubTaskDescription, setNewSubTaskDescription] = useState("");

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim() || !newSubTaskDescription.trim()) {
      alert("Both title and description are required for subtasks.");
      return;
    }
    onAddSubTask(newSubTaskTitle, newSubTaskDescription);
    setNewSubTaskTitle("");
    setNewSubTaskDescription("");
  };

  return (
    <li style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "5px" }}>
      <div>
        <label>
          <input type="checkbox" checked={task.completed} onChange={onToggle} />
          <strong>{task.title}</strong> {category && <em>[{category.name}]</em>}
        </label>
        <p>{task.description}</p>
        {task.dueDate && <span>Due: {task.dueDate}</span>}
      </div>

      <button onClick={() => onEdit(task)}>Edit Task</button>
      <button onClick={onRemove}>Delete Task</button>

      {/* Subtasks */}
      <ul style={{ paddingLeft: "1.5rem" }}>
        {task.subtasks.map(st => (
          <li key={st.id}>
            {editingSubTaskId === st.id ? (
              <div>
                <input
                  type="text"
                  value={subTaskTitle}
                  placeholder="Subtask title"
                  onChange={e => setSubTaskTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={subTaskDescription}
                  placeholder="Subtask description"
                  onChange={e => setSubTaskDescription(e.target.value)}
                />
                <button onClick={() => {
                  if (!subTaskTitle.trim() || !subTaskDescription.trim()) {
                    alert("Both title and description are required.");
                    return;
                  }
                  onUpdateSubTask(st.id, { title: subTaskTitle, description: subTaskDescription });
                  setEditingSubTaskId(null);
                }}>Save</button>
                <button onClick={() => setEditingSubTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <label>
                  <input type="checkbox" checked={st.completed} onChange={() => onToggleSubTask(st.id)} />
                  <strong>{st.title}</strong>: {st.description}
                </label>
                <button onClick={() => {
                  setEditingSubTaskId(st.id);
                  setSubTaskTitle(st.title);
                  setSubTaskDescription(st.description);
                }}>Edit</button>
                <button onClick={() => onRemoveSubTask(st.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Inline Add Subtask Form */}
      <div style={{ marginTop: "0.5rem" }}>
        <input
          type="text"
          placeholder="Subtask title"
          value={newSubTaskTitle}
          onChange={e => setNewSubTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtask description"
          value={newSubTaskDescription}
          onChange={e => setNewSubTaskDescription(e.target.value)}
        />
        <button onClick={handleAddSubTask}>+ Add Subtask</button>
      </div>
    </li>
  );
}
