// File: src/pages/ProjectSelectPage.jsx
import AppLayout from "../../components/AppLayout";
import "./ProjectSelectPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateProjectModal from "../../components/CreateProjectModal";
import { FiMail } from "react-icons/fi";

function ProjectSelectPage() {
  const navigate = useNavigate();
  const [yourprojects, setYourProjects] = useState([]);
  const [invitedprojects, setInvitedProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // Get user once
  const [showModal, setShowModal] = useState(false);
  const [yourSearchTerm, setYourSearchTerm] = useState("");
  const [invitedSearchTerm, setInvitedSearchTerm] = useState("");
  const [invites, setInvites]=useState([]);
  const [showInvites, setShowInvites]=useState(false);
   const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
      fetchInvites(user.id);
    } else {
      console.error("User not found in localStorage or missing id");
    }
  }, []);

  const fetchInvites=async(userId)=>{
    try{
       const res = await axios.get(
        `${API_URL}/api/projects/invites/${userId}`,
        {
          withCredentials: true,
        }
      );
     setInvites(res.data);
    }
     catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const fetchProjects = async (userId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/projects/${userId}`,
        {
          withCredentials: true,
        }
      );
      setYourProjects(res.data);
      const rest = await axios.get(
        `${API_URL}/api/projects/invited/${userId}`,
        {
          withCredentials: true,
        }
      );
      setInvitedProjects(rest.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
   const handleResponse=async(response, inviteId)=>{
     try {
      const res = await axios.post(
        `${API_URL}/api/projects/invites/respond`,
        {
          invite_id:inviteId,
          action: response,
          user_id: user.id,
        },
        {
          withCredentials: true,
        });
        if (res.status === 200) {
        fetchProjects(user.id);
         fetchInvites(user.id);
        }
      }
      catch(err){
        console.error("error fetching invites");
      }
   };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/projects/delete/${projectId}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        // Refresh project list
        const user = JSON.parse(localStorage.getItem("user"));
        fetchProjects(user.id);
      } else {
        console.error("Unexpected response while deleting project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleProjectClick = (project) => {
    localStorage.setItem("selectedProject", JSON.stringify(project));
    navigate("/home/dashboard");
  };

  const handleCreateProject = () => {
    setShowModal(true);
  };

  const createProject = async (projectName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      console.error("User ID not found.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/projects/create`,
        {
          title: projectName,
          user_id: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        fetchProjects(user.id);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }

    setShowModal(false);
  };
  const filteredYourProjects = yourprojects.filter((project) =>
    project.title.toLowerCase().includes(yourSearchTerm.toLowerCase())
  );

  const filteredInvitedProjects = invitedprojects.filter((project) =>
    project.title.toLowerCase().includes(invitedSearchTerm.toLowerCase())
  );

  return (
   <AppLayout>
  <div className="invite-icon-wrapper" onClick={() => setShowInvites(true)} title="View Invites">
    <FiMail className="invite-icon" />
    {invites.length !== 0 && <span className="invite-dot"></span>}
  </div>
  
       {showInvites && (
  <div className="invite-popup">
    <div className="invite-popup-header">
      <h2>Pending Invites</h2>
      <button onClick={() => setShowInvites(false)}>✖</button>
    </div>
    <div className="invite-popup-content">
      {invites.length === 0 ? (
        <p>No invites available</p>
      ) : (
        invites.map((invite) => (
          <div className="invite_card" key={invite.id}>
            <h3>{invite.project_name}</h3>
            <h4>From: {invite.inviter_name}</h4>
            <button onClick={() => handleResponse("accept", invite.id)}>
              Accept
            </button>
            <button onClick={() => handleResponse("ignore", invite.id)}>
              Ignore
            </button>
          </div>
        ))
      )}
    </div>
  </div>
)}
        <div className="main_content">
          <h1>YOUR PROJECTS</h1>
          <input
            type="text"
            className="search-input"
            placeholder="Search your projects..."
            value={yourSearchTerm}
            onChange={(e) => setYourSearchTerm(e.target.value)}
          />
          <div className="scroll-container">
            <div className="project-grid horizontal">
              <div
                className="project-card create"
                onClick={handleCreateProject}
              >
                <div className="plus">+</div>
                <p>Create New Project</p>
              </div>
              <CreateProjectModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={createProject}
              />

              {filteredYourProjects.map((project) => (
                <div className="project-card" key={project.id}>
                  <h3>{project.title}</h3>
                  <div className="project-actions">
                    <button
                      className="btn"
                      onClick={() => handleProjectClick(project)}
                    >
                      Select
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete project"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="main_content">
          <h1>INVITED PROJECTS</h1>
         
          <input
            type="text"
            className="search-input"
            placeholder="Search invited projects..."
            value={invitedSearchTerm}
            onChange={(e) => setInvitedSearchTerm(e.target.value)}
          />

          <div className="scroll-container">
            <div className="project-grid horizontal">
              {filteredInvitedProjects.map((project) => (
                <div className="project-card" key={project.id}>
                  <h3>{project.title}</h3>
                  <button
                    className="btn"
                    onClick={() => handleProjectClick(project)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
    
    </AppLayout>
  );
}

export default ProjectSelectPage;
