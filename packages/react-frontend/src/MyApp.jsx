import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import CategoryPage from "./CategoryPage";

const EditableCategory = ({ name, taskCount, onClick }) => {
  return (
    <div
      className="category-box"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <h3>{name}</h3>
      <p className="task-count">({taskCount} tasks)</p>
    </div>
  );
};

function MyApp() {
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState("Loading...");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("crumblist-categories");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "School" },
          { name: "Work" },
          { name: "Errands" },
          { name: "Health" },
          { name: "Fitness" },
          { name: "Chores" },
        ];
  });

  const butterTasks = tasks
    .filter((task) => Number(task.ease) < 60)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const normalTasks = tasks.filter((task) => Number(task.ease) >= 60);
  const butterTaskIds = butterTasks.map((task) => task._id);
  const selectedButterIds = checkedTasks.filter((id) =>
    butterTaskIds.includes(id),
  );

  const tasksByCategory = {};
  categories.forEach((cat) => {
    tasksByCategory[cat.name] = normalTasks
      .filter((task) => task.category?.toLowerCase() === cat.name.toLowerCase())
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
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

  useEffect(() => {
    fetch(
      "https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks",
    )
      .then((res) => res.json())
      .then((json) => setTasks(json.task_list || []))
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("crumblist-categories", JSON.stringify(categories));
  }, [categories]);

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
            : `${fallback} – Mr. Crumb`,
        );
      })
      .catch(() => setQuote(`${fallback} – Mr. Crumb`));
  }, []);

  const toggleChecked = (taskId) => {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const completeCheckedTasks = (idsToDelete = checkedTasks) => {
    const updatedTasks = tasks.filter(
      (task) => !idsToDelete.includes(task._id),
    );
    setTasks(updatedTasks);
    setCheckedTasks((prev) => prev.filter((id) => !idsToDelete.includes(id)));
    idsToDelete.forEach((id) => {
      fetch(
        `https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks/${id}`,
        {
          method: "DELETE",
        },
      ).catch((err) => console.error("Delete failed", err));
    });
  };

  const updateCategoryName = (index, newName) => {
    const updated = [...categories];
    updated[index].name = newName;
    setCategories(updated);
  };

  const openCategoryModal = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className="pink-background">
      {location.pathname.startsWith("/category/") ? (
        <CategoryPage
          tasks={tasks}
          checkedTasks={checkedTasks}
          toggleChecked={toggleChecked}
          completeCheckedTasks={completeCheckedTasks}
        />
      ) : (
        <>
          {/* Hamburger Menu */}
          <div
            className="hamburger-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </div>

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`sidebar ${sidebarOpen ? "open" : ""}`}
          >
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
            <ul>
              <li>
                <button className="sidebar-link" onClick={() => navigate("/")}>
                  🏠 Home
                </button>
              </li>
              <li>
                <button
                  className="sidebar-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  📆 Calendar View
                </button>
              </li>
              <li>
                <button
                  className="sidebar-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  👤 Profile
                </button>
              </li>
              <li>
                <button
                  className="sidebar-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  ⚙️ Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Home Page Content */}
          <div className="title-box">
            <h1>CrumbList 🥖</h1>
          </div>

          <div className="category-grid">
            {categories.map((cat, index) => (
              <EditableCategory
                key={index}
                name={cat.name}
                index={index}
                onNameChange={updateCategoryName}
                taskCount={tasksByCategory[cat.name]?.length || 0}
                onClick={() => openCategoryModal(cat.name)}
              />
            ))}
          </div>

          <div className="butter-row">
            <div className="butter-tasks">
              <div className="butter-title">
                🧈 Butter Tasks{" "}
                <span className="task-count">({butterTasks.length})</span>
              </div>
              {butterTasks.length === 0 ? (
                <p className="no-butter">
                  No quick tasks under 60 minutes yet.
                </p>
              ) : (
                <div className="butter-task-grid">
                  {butterTasks.map((task) => (
                    <div key={task._id} className="butter-task-grid-row">
                      <span>
                        {task.name} ({task.ease} min)
                      </span>
                      <input
                        type="checkbox"
                        checked={checkedTasks.includes(task._id)}
                        onChange={() => toggleChecked(task._id)}
                      />
                    </div>
                  ))}
                </div>
              )}
              {selectedButterIds.length > 0 && (
                <button
                  className="complete-button"
                  onClick={() => completeCheckedTasks(selectedButterIds)}
                >
                  Remove Selected ({selectedButterIds.length})
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

          <div className="quote-box">
            <blockquote>{quote}</blockquote>
          </div>

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

EditableCategory.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onNameChange: PropTypes.func.isRequired,
  taskCount: PropTypes.number,
  onClick: PropTypes.func,
};

export default MyApp;
