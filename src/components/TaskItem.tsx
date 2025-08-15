import { useState } from "react";
import { Task, Category, SubTask } from "../types";
import { isoToUSDate } from "../utils/date";

interface TaskItemProps {
  task: Task;
  category?: Category;
  onToggle: () => void;
  onRemove: () => void;
  onEdit: (task: Task) => void;
  onAddSubTask: (title: string) => void;
  onToggleSubTask: (id: number) => void;
  onRemoveSubTask: (id: number) => void;
  onUpdateSubTask: (subTaskId: number, updates: { title?: string; }) => void;
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
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) {
      alert("Title is required for subtasks.");
      return;
    }
    onAddSubTask(newSubTaskTitle);
    setNewSubTaskTitle("");
  };

  return (
    <li style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "5px" }}>
      <div>
        <label>
          <input type="checkbox" checked={task.completed} onChange={onToggle} />
          <strong>{task.title}</strong> {category && <span>[{category.name}]</span>}
        </label>
      </div>
      <div style={{ marginLeft: "0.25rem", marginTop: "0.25rem" }}>
        {task.dueDate && <span>Due date: {isoToUSDate(task.dueDate)}</span>}
      </div>
      <button style={{ marginRight: "0.5rem", marginBottom: "0.5rem", marginTop: "0.5rem" }} onClick={() => onEdit(task)}>Edit Task</button>
      <button onClick={onRemove}>Delete Task</button>
      
      <ul style={{ paddingLeft: "1.5rem", listStyleType: "none"}}>
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
                <button onClick={() => {
                  if (!subTaskTitle.trim()) {
                    alert("Title is required.");
                    return;
                  }
                  onUpdateSubTask(st.id, { title: subTaskTitle });
                  setEditingSubTaskId(null);
                }}>Save</button>
                <button onClick={() => setEditingSubTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <label>
                  <input type="checkbox" checked={st.completed} onChange={() => onToggleSubTask(st.id)} />
                  <strong style={{ marginRight: "0.5rem" }}>{st.title}</strong>
                </label>
                <button style={{ marginRight: "0.5rem" }} onClick={() => {
                  setEditingSubTaskId(st.id);
                  setSubTaskTitle(st.title);
                }}>Edit</button>
                <button onClick={() => onRemoveSubTask(st.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "0.5rem" }}>
        <input style={{ marginRight: "0.5rem" }}
          type="text"
          placeholder="Subtask title"
          value={newSubTaskTitle}
          onChange={e => setNewSubTaskTitle(e.target.value)}
        />
        <button onClick={handleAddSubTask}>Add Subtask</button>
      </div>
    </li>
  );
}
