import React from "react";
import TaskInputForm from "./TaskInputForm";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "School" },
  { name: "Work" },
  { name: "Errands" },
  { name: "Health" },
  { name: "Fitness" },
  { name: "Chores" },
];

function TaskFormPage() {
  const navigate = useNavigate();

  const handleFormSubmit = (task) => {
    console.log("Submitting to backend:", task);
    
    fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((newTask) => {
        console.log("Task added successfully:", newTask);
        alert("Task added successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to add task:", err);
        alert(`Failed to add task: ${err.message}`);
      });
  };

  return (
    <div className="form-page">
      <h2 className="form-heading">Add a New Task 📝</h2>
      <TaskInputForm categories={categories} onSubmit={handleFormSubmit} />
      <div className="form-buttons">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to CrumbList
        </button>
      </div>
    </div>
  );
}

export default TaskFormPage;
