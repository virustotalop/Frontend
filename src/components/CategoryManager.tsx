import { Category } from "../types";

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (name: string) => void;
  onRename: (id: number, newName: string) => void;
  onRemove: (id: number) => void;
}

export default function CategoryManager({
  categories,
  onAdd,
  onRename,
  onRemove
}: CategoryManagerProps) {
  return (
    <div style={{ marginBottom: "1em" }}>
      <h2>Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            {cat.name}
            <button onClick={() => {
              const newName = prompt("New category name:", cat.name);
              if (newName) onRename(cat.id, newName);
            }}>Edit</button>
            <button onClick={() => onRemove(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => {
        const name = prompt("Category name:");
        if (name) onAdd(name);
      }}>Add Category</button>
    </div>
  );
}