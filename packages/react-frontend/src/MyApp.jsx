import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CuteBread from "./CuteBread";
import CalendarView from "./CalendarView";
import EditableCategory from "./EditableCategory";
import { useSettings } from "./useSettings";
import { useTasks } from "./useTasks";
import { useProfile } from "./useProfile";
import { getAchievements, breadQuotes } from "./achievements";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  // Custom hooks
  const { settings, updateSetting, requestNotificationPermission, clearCompletedTasks, resetCategoriesToDefault } = useSettings();
  const { tasks, checkedTasks, progress, toggleChecked, completeCheckedTasks } = useTasks();
  const { userProfile, editingProfile, updateProfile, handleProfileKeyDown } = useProfile();

  // Quote state
  const [quote] = useState(() => {
    const randomQuote = breadQuotes[Math.floor(Math.random() * breadQuotes.length)];
    return `${randomQuote} – Mr. Crumb`;
  });

  // Categories state
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

  // Task filtering
  const butterTasks = tasks
  .filter((task) => Number(task.ease) < settings.butterThreshold)
  .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
   const normalTasks = tasks.filter((task) => Number(task.ease) >= settings.butterThreshold);
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

  // Save categories
  useEffect(() => {
    localStorage.setItem('crumblist-categories', JSON.stringify(categories));
  }, [categories]);

  // Apply themes
  useEffect(() => {
    document.body.className = `theme-${settings.colorTheme} ${settings.darkMode ? 'dark-mode' : ''}`;
    const pinkBg = document.querySelector('.pink-background');
    if (pinkBg) {
      pinkBg.className = `pink-background theme-${settings.colorTheme} ${settings.darkMode ? 'dark-mode' : ''}`;
    }
  }, [settings.darkMode, settings.colorTheme]);

  // Sidebar outside click
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

  // Helper functions
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
          <div className="settings-content">
            
            {/* Theme Settings */}
            <div className="settings-section">
              <h3>🎨 Theme & Appearance</h3>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.darkMode}
                    onChange={(e) => updateSetting('darkMode', e.target.checked)}
                  /> 
                  Enable Dark Mode
                </label>
              </div>
              <div className="setting-item">
                <label>
                  Color Theme:
                  <select 
                    value={settings.colorTheme} 
                    onChange={(e) => updateSetting('colorTheme', e.target.value)}
                  >
                    <option value="pink">Pink (Default)</option>
                    <option value="blue">Blue Pastel</option>
                    <option value="green">Green Pastel</option>
                    <option value="purple">Purple Pastel</option>
                    <option value="orange">Orange Pastel</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Task Settings */}
            <div className="settings-section">
              <h3>🧈 Butter Task Settings</h3>
              <div className="setting-item">
                <label>
                  Butter task threshold (tasks under this duration):
                  <select 
                    value={settings.butterThreshold} 
                    onChange={(e) => updateSetting('butterThreshold', Number(e.target.value))}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.showButterInCalendar}
                    onChange={(e) => updateSetting('showButterInCalendar', e.target.checked)}
                  /> 
                  Show butter tasks in calendar view
                </label>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="settings-section">
              <h3>🔔 Notifications</h3>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.dailyQuotes}
                    onChange={(e) => {
                      updateSetting('dailyQuotes', e.target.checked);
                      if (e.target.checked) {
                        requestNotificationPermission();
                      }
                    }}
                  /> 
                  Daily motivation quote notifications
                </label>
              </div>
            </div>

            {/* Data Settings */}
            <div className="settings-section">
              <h3>💾 Data Management</h3>
              <div className="setting-item">
                <button className="settings-button danger-btn" onClick={clearCompletedTasks}>
                  🗑️ Clear All Completed Tasks
                </button>
              </div>
              <div className="setting-item">
                <button className="settings-button warning-btn" onClick={() => resetCategoriesToDefault(setCategories)}>
                  🔄 Reset Categories to Default
                </button>
              </div>
            </div>

          </div>

      {/* Calendar Page */}
      {activePage === "calendar" && (
        <div className="calendar-page">
          <CalendarView tasks={tasks} showButterTasks={settings.showButterInCalendar} />
        </div>
      )}

      {/* Profile Page */}
      {activePage === "profile" && (
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <svg className="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9Z"/>
                  <path d="M12 7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13C6 9.69 8.69 7 12 7Z"/>
                  <path d="M12 8.5C13.93 8.5 15.5 10.07 15.5 12S13.93 15.5 12 15.5S8.5 13.93 8.5 12S10.07 8.5 12 8.5Z"/>
                </svg>
              </div>
            </div>
            <div className="profile-info">
              {editingProfile.title ? (
                <input
                  type="text"
                  defaultValue={userProfile.title}
                  autoFocus
                  onBlur={(e) => updateProfile('title', e.target.value)}
                  onKeyDown={(e) => handleProfileKeyDown(e, 'title')}
                  className="profile-edit-input title-input"
                />
              ) : (
                <h1 
                  className="profile-title"
                  onClick={() => updateProfile('editTitle', true)}
                >
                  {userProfile.title}
                </h1>
              )}
              
              {editingProfile.name ? (
                <input
                  type="text"
                  defaultValue={userProfile.name}
                  autoFocus
                  onBlur={(e) => updateProfile('name', e.target.value)}
                  onKeyDown={(e) => handleProfileKeyDown(e, 'name')}
                  className="profile-edit-input name-input"
                />
              ) : (
                <p 
                  className="profile-name"
                  onClick={() => updateProfile('editName', true)}
                >
                  {userProfile.name}
                </p>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{checkedTasks.length}</div>
              <div className="stat-label">Completed Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{butterTasks.length}</div>
              <div className="stat-label">Butter Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progress}%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="signout-btn" onClick={() => navigate("/login")}>
              🚪 Sign Out
            </button>
          </div>

          <div className="profile-achievements">
            <h3>🏆 Achievements</h3>
            <div className="achievement-grid">
              {getAchievements(tasks, butterTasks, progress, checkedTasks, categories).map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  <div className="badge-icon">{achievement.icon}</div>
                  <div className="badge-content">
                    <div className="badge-text">{achievement.text}</div>
                    <div className="badge-desc">{achievement.desc}</div>
                  </div>
                </div>
              ))}
              {getAchievements(tasks, butterTasks, progress, checkedTasks, categories).length === 0 && (
                <div className="no-achievements">
                  <p>Complete tasks to unlock achievements! 🎯</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Home Page */}
      {activePage === "home" && (
        <>
          <div className="title-box">
            <h1>
              CrumbList <CuteBread size="35px" />
            </h1>
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
              <button
                className="calendar-view-button"
                onClick={() => setActivePage("calendar")}
              >
                📅 Calendar View
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
