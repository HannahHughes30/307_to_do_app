import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addAuthHeader } from "../pages/MyApp.jsx";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  

  // Fetch tasks from backend
  const fetchTasks = () => {
    fetch("http://localhost:8000/tasks", {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("Fetched tasks:", json.task_list);
        setTasks(json.task_list || []);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
        navigate("/login");
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate progress
  useEffect(() => {
    const total = tasks.length;
    const completed = checkedTasks.length;
    const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
    setProgress(percent);
  }, [checkedTasks, tasks]);

  const toggleChecked = (taskId) => {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const completeCheckedTasks = () => {
    const updatedTasks = tasks.filter((task) => {
      return !checkedTasks.includes(task._id);
    });

    setTasks(updatedTasks);
    setCheckedTasks([]);

    // Delete from backend
    checkedTasks.forEach((id) => {
      fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
        headers: addAuthHeader({
          "Content-Type": "application/json"
        }),
      }).catch((err) => console.error("Delete failed", err));
    });
  };

  return {
    tasks,
    checkedTasks,
    progress,
    toggleChecked,
    completeCheckedTasks,
    fetchTasks,
  };
};
