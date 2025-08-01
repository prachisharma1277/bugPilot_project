// src/components/ProjectForm.jsx
import React, { useState } from "react";
import "./ProjectForm.css";

function ProjectForm({ onClose }) {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`New project created: ${projectName}`);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Create New Project</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            required
          />
          <div>
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
