import './CreateProjectModal.css';
import { useState } from 'react';

function CreateProjectModal({ isOpen, onClose, onSubmit }) {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = () => {
    if (projectName.trim()) {
      onSubmit(projectName.trim());
      setProjectName("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Create New Project</h2>
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn" onClick={handleSubmit}>Create</button>
          <button className="btn cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectModal;
