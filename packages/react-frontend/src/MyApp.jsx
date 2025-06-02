import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Cute Bread Component
const CuteBread = ({ size = "40px", className = "" }) => {
  return (
    <div className={`cute-bread ${className}`} style={{ width: size, height: size }}>
      <div className="bread-body">
        <div className="bread-eyes">
          <div className="eye left-eye"></div>
          <div className="eye right-eye"></div>
        </div>
        <div className="bread-mouth"></div>
        <div className="bread-cheeks">
          <div className="cheek left-cheek"></div>
          <div className="cheek right-cheek"></div>
        </div>
      </div>
    </div>
  );
};

CuteBread.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
};

// Calendar Component
const CalendarView = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    if (urgency <= 2) return "#28a745"; // Green (low)
    if (urgency <= 4) return "#ffc107"; // Yellow
    if (urgency <= 6) return "#fd7e14"; // Orange
    if (urgency <= 8) return "#dc3545"; // Red
    return "#6f42c1"; // Purple (highest)
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  };

  const days = getDaysInMonth();
  const today = new Date();

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>📆 Calendar View</h2>
        <div className="calendar-navigation">
          <button className="nav-btn" onClick={() => navigateMonth('prev')}>&lt;</button>
          <span className="calendar-month-year">
            {months[currentMonth]} {currentYear}
          </span>
          <button className="nav-btn" onClick={() => navigateMonth('next')}>&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="calendar-day-number">{date.getDate()}</div>
                {dayTasks.length > 0 && (
                  <div className="calendar-tasks">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div
                        key={i}
                        className="calendar-task-dot"
                        style={{ backgroundColor: getUrgencyColor(task.urgency) }}
                        title={`${task.name} (Urgency: ${task.urgency})`}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="calendar-task-more">+{dayTasks.length - 3}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="calendar-selected-date">
          <h3>Tasks for {selectedDate.toLocaleDateString()}</h3>
          {getTasksForDate(selectedDate).length === 0 ? (
            <p>No tasks scheduled for this date.</p>
          ) : (
            <div className="calendar-task-list">
              {getTasksForDate(selectedDate).map(task => (
                <div key={task._id} className="calendar-task-item">
                  <div
                    className="task-urgency-dot"
                    style={{ backgroundColor: getUrgencyColor(task.urgency) }}
                  />
                  <div className="task-details">
                    <strong>{task.name}</strong>
                    <div className="task-meta">
                      {task.category} • {task.ease} min • Urgency: {task.urgency}/10
                    </div>
                    {task.description && <p className="task-description">{task.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="calendar-legend">
        <h4>Urgency Scale:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#28a745" }}></div>
            <span>Low (1-2)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#ffc107" }}></div>
            <span>Medium (3-4)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#fd7e14" }}></div>
            <span>High (5-6)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#dc3545" }}></div>
            <span>Urgent (7-8)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#6f42c1" }}></div>
            <span>Critical (9-10)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

CalendarView.propTypes = {
  tasks: PropTypes.array.isRequired,
};

const EditableCategory = ({ name, index, onNameChange, taskCount, onClick }) => {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleBlur = () => {
    setEditing(false);
    onNameChange(index, tempName);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditing(false);
      onNameChange(index, tempName);
    }
  };

  const handleCategoryClick = () => {
    setEditing(true);
  };

  const handleViewTasksClick = (e) => {
    e.stopPropagation();
    onClick();
  };

  return editing ? (
    <input
      type="text"
      value={tempName}
      autoFocus
      onChange={(e) => setTempName(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="category-input"
    />
  ) : (
    <div className="category-box" style={{ cursor: "pointer" }}>
      <h3 
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        style={{ cursor: "text" }}
      >
        {name || <em>Click to name me</em>}
      </h3>
      {name && (
        <p 
          className="task-count"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{ cursor: "pointer" }}
        >
          ({taskCount} tasks)
        </p>
      )}
    </div>
  );
};

function MyApp() {
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();
  const sidebarRef = useRef();

  // Bread-themed quotes
  const breadQuotes = [
    "Stay focused and keep toasting.",
    "Small crumbs lead to big loaves.",
    "No task is too crusty to conquer.",
    "Rise to the occasion like good dough.",
    "Every great achievement starts with a single grain.",
    "Knead your goals until they're perfect.",
    "Life is what you bake it.",
    "Don't loaf around - get things done!",
    "You're the yeast that makes things rise.",
    "Success is a recipe worth following.",
    "Proof that hard work pays off.",
    "Butter believe in yourself!",
    "Time to roll up your sleeves and get baking.",
    "Fresh starts are like warm bread - always better.",
    "Slice through challenges one task at a time."
  ];

  // Random quote that changes on each render/refresh
  const [quote] = useState(() => {
    const randomQuote = breadQuotes[Math.floor(Math.random() * breadQuotes.length)];
    return `${randomQuote} – Mr. Crumb`;
  });

  // Initialize categories from localStorage or use defaults
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('crumblist-categories');
    if (savedCategories) {
      return JSON.parse(savedCategories);
    }
    return [
      { name: "School" },
      { name: "Work" },
      { name: "Errands" },
      { name: "Health" },
      { name: "Fitness" },
      { name: "Chores" }
    ];
  });

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
    fetch("https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks")
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

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('crumblist-categories', JSON.stringify(categories));
  }, [categories]);

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
      fetch(`https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks/${id}`, {
        method: "DELETE",
      }).catch((err) => console.error("Delete failed", err));
    });
  };

  const updateCategoryName = (index, newName) => {
    const updated = [...categories];
    updated[index].name = newName;
    setCategories(updated);
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
          <CalendarView tasks={tasks} />
        </div>
      )}

      {/* Profile Page */}
      {activePage === "profile" && (
        <div className="profile-page">
          <h2>👤 Profile</h2>
          <div className="profile-placeholder">
            <p> Welcome to your profile!</p>
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
            <h1>
              CrumbList <CuteBread size="50px" />
            </h1>
          </div>

          {/* Category Grid */}
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
                  {tasksByCategory[selectedCategory]?.length === 0 ? (
                    <p>No tasks in this category yet.</p>
                  ) : (
                    <ul className="modal-task-list">
                      {tasksByCategory[selectedCategory]?.map((task) => (
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
                  Remove Selected ({checkedTasks.length})
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
              <button
                className="calendar-view-button"
                onClick={() => setActivePage("calendar")}
              >
                📅 Calendar View
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

EditableCategory.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onNameChange: PropTypes.func.isRequired,
  taskCount: PropTypes.number,
  onClick: PropTypes.func,
};

export default MyApp;
