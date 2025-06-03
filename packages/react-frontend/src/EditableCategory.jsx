import React, { useState } from "react";
import PropTypes from "prop-types";

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

EditableCategory.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onNameChange: PropTypes.func.isRequired,
  taskCount: PropTypes.number,
  onClick: PropTypes.func,
};

export default EditableCategory;
