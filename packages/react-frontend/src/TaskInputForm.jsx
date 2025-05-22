import React, { useState } from "react";
import PropTypes from "prop-types";

const TaskInputForm = ({ onSubmit, categories }) => {
  const [task, setTask] = useState({
    title: "",
    dueDate: "",
    category: "",
    notes: "",
    expectedTime: "",
    urgency: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Map frontend fields to backend schema
    const backendTask = {
      name: task.title,
      category: task.category,
      description: task.notes,
      due_date: task.dueDate,
      urgency: Number(task.urgency),
      ease: Number(task.expectedTime.replace(/\D/g, '')) || Number(task.expectedTime), // Remove non-digits
    };

    console.log("Submitting task:", backendTask);
    onSubmit(backendTask);
    
    // Clear form
    setTask({
      title: "",
      dueDate: "",
      category: "",
      notes: "",
      expectedTime: "",
      urgency: "",
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Task title"
        value={task.title}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        required
      />
      <select name="category" value={task.category} onChange={handleChange} required>
        <option value="">Select category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <select name="urgency" value={task.urgency} onChange={handleChange} required>
        <option value="">Select urgency (1 = low, 10 = high)</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <textarea
        name="notes"
        placeholder="Notes..."
        value={task.notes}
        onChange={handleChange}
      />
      <input
        type="number"
        name="expectedTime"
        placeholder="Expected time in minutes (e.g. 30)"
        value={task.expectedTime}
        onChange={handleChange}
        required
      />
      <button type="submit" className="add-task-button">
        Add Task
      </button>
    </form>
  );
};

TaskInputForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TaskInputForm;
