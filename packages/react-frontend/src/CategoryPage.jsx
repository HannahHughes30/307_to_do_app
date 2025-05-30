import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CategoryPage = ({ tasks, checkedTasks, toggleChecked }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const filteredTasks = tasks.filter(
    (task) => task.category?.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="category-page">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>{categoryName} Tasks</h2>
      {filteredTasks.length === 0 ? (
        <p>No tasks in this category yet.</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
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
  );
};

export default CategoryPage;
