import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function MyApp() {
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState("Loading...");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const categories = [
    { name: "School" },
    { name: "Work" },
    { name: "Errands" },
    { name: "Health" },
    { name: "Fitness" },
    { name: "Chores" },
  ];

  // Separate tasks by ease (expectedTime equivalent)
  const butterTasks = tasks.filter((task) => Number(task.ease) < 60);
  const normalTasks = tasks.filter((task) => Number(task.ease) >= 60);

  // Group normal tasks by category
  const tasksByCategory = {};
  categories.forEach((cat) => {
    tasksByCategory[cat.name] = normalTasks.filter(
      (task) => task.category === cat.name
    );
  });

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Fetch tasks from backend
  const fetchTasks = () => {
    fetch("http://localhost:8000/tasks")
      .then((res) => res.json())
      .then((json) => {
        console.log("Fetched tasks:", json.task_list);
        setTasks(json.task_list || []);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const total = tasks.length;
    const completed = checkedTasks.length;
    const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
    setProgress(percent);
  }, [checkedTasks, tasks]);

  useEffect(() => {
    const fallbackQuotes = [
      "Stay focused and keep toasting.",
      "Small crumbs lead to big loaves.",
      "No task is too crusty to conquer.",
    ];
    const fallback =
      fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote(
          random?.text
            ? `${random.text} – Mr. Crumb`
            : `${fallback} – Mr. Crumb`
        );
      })
      .catch(() => setQuote(`${fallback} – Mr. Crumb`));
  }, []);

  const toggleChecked = (taskId) => {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
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
      }).catch((err) => console.error("Delete failed", err));
    });
  };

  const openCategoryModal = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const closeCategoryModal = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="pink-background">
      {/* Hamburger Menu */}
      <div
        className="hamburger-menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </div>

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <ul>
          <li>
            <button
              className="sidebar-link"
              onClick={() => {
                setActivePage("home");
                setSidebarOpen(false);
              }}
            >
              🏠 Home
            </button>
          </li>
          <li>
            <button 
              className="sidebar-link"
              onClick={() => {
                setActivePage("calendar");
                setSidebarOpen(false);
              }}
            >
              📆 Calendar View
            </button>
          </li>
          <li>
            <button 
              className="sidebar-link"
              onClick={() => {
                setActivePage("profile");
                setSidebarOpen(false);
              }}
            >
              👤 Profile
            </button>
          </li>
          <li>
            <button
              className="sidebar-link"
              onClick={() => {
                setActivePage("settings");
                setSidebarOpen(false);
              }}
            >
              ⚙️ Settings
            </button>
          </li>
        </ul>
      </div>

      {/* Settings Page */}
      {activePage === "settings" && (
        <div className="settings-page">
          <h2>⚙️ Settings</h2>
          <div className="settings-placeholder">
            <p>🛠 Settings coming soon:</p>
            <ul>
              <li>Dark mode</li>
              <li>Font size</li>
              <li>Task sorting preferences</li>
              <li>Show/hide motivational quotes</li>
            </ul>
          </div>
        </div>
      )}

      {/* Calendar Page */}
      {activePage === "calendar" && (
        <div className="calendar-page">
          <h2>📆 Calendar View</h2>
          <div className="calendar-placeholder">
            <p>📅 Calendar view coming soon!</p>
            <p>Here you'll be able to see your tasks organized by due date.</p>
          </div>
        </div>
      )}

      {/* Profile Page */}
      {activePage === "profile" && (
        <div className="profile-page">
          <h2>👤 Profile</h2>
          <div className="profile-placeholder">
            <p>👋 Welcome to your profile!</p>
            <p>Profile customization coming soon:</p>
            <ul>
              <li>Task completion statistics</li>
              <li>Productivity insights</li>
              <li>Achievement badges</li>
            </ul>
          </div>
        </div>
      )}

      {/* Home Page */}
      {activePage === "home" && (
        <>
      <div className="title-box">
        <h1>CrumbList 🥖</h1>
      </div>

      {/* Category Grid */}
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-box"
            onClick={() => openCategoryModal(cat.name)}
            style={{ cursor: "pointer" }}
          >
            <h3>{cat.name}</h3>
            <p className="task-count">({tasksByCategory[cat.name].length} tasks)</p>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="modal-overlay" onClick={closeCategoryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCategory} Tasks</h2>
              <button className="close-button" onClick={closeCategoryModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {tasksByCategory[selectedCategory].length === 0 ? (
                <p>No tasks in this category yet.</p>
              ) : (
                <ul className="modal-task-list">
                  {tasksByCategory[selectedCategory].map((task) => (
                    <li key={task._id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checkedTasks.includes(task._id)}
                          onChange={() => toggleChecked(task._id)}
                        />
                        <strong>{task.name}</strong> - {task.ease} minutes
                        {task.description && <p>{task.description}</p>}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Butter Tasks */}
      <div className="butter-row">
        <div className="butter-tasks">
          <div className="butter-title">🧈 Butter Tasks <span className="task-count">({butterTasks.length})</span></div>
          {butterTasks.length === 0 ? (
            <p className="no-butter">No quick tasks under 60 minutes yet.</p>
          ) : (
            <div className="butter-task-grid">
              {butterTasks.map((task) => (
                <div key={task._id} className="butter-task-grid-row">
                  <span>{task.name} ({task.ease} min)</span>
                  <input
                    type="checkbox"
                    checked={checkedTasks.includes(task._id)}
                    onChange={() => toggleChecked(task._id)}
                  />
                </div>
              ))}
            </div>
          )}
          {checkedTasks.length > 0 && (
            <button className="complete-button" onClick={completeCheckedTasks}>
              ✅ Complete Selected ({checkedTasks.length})
            </button>
          )}
        </div>
        <div className="button-col">
          <button
            className="add-task-button"
            onClick={() => navigate("/add-task")}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Quote */}
      <div className="quote-box">
        <blockquote>{quote}</blockquote>
      </div>

      {/* Toast Progress Bar */}
      <div className="toast-section">
        <h2>Toast Your Tasks…</h2>
        <div className="toast-bar-wrapper">
          <div className="emoji-fire">🔥</div>
          <div className="toast-bar">
            <div
              className="toast-fill"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="toast-text">
              {progress === 100
                ? "100% Completed!"
                : `Task Progress (${progress}%)`}
            </div>
          </div>
          <span className="emoji-bread">🍞</span>
        </div>
      </div>

        </>
      )}
    </div>
  );
}

export default MyApp;
