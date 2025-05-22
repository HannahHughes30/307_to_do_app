import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyApp from "./MyApp";
import TaskFormPage from "./TaskFormPage";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyApp />} />
        <Route path="/add-task" element={<TaskFormPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
