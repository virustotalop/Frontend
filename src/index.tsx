import React from 'react';
import { createRoot } from "react-dom/client";
import TaskPage from "./pages/TaskPage";


const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <TaskPage />
  </React.StrictMode>
);