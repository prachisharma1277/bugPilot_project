import React, { useEffect, useState } from "react";
import "./DashboardPage.css";
import AppLayout from "../../components/AppLayout";
import axios from "axios";

export default function DashboardPage() {
  const [bugs, setBugs] = useState([]);
  const [team, setTeam] = useState([]);
  const [flash,setFlash]=useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showRegisterInviteModal, setShowRegisterInviteModal] = useState(false);
  const inviteLink = "https://yourapp.com/register";
  const user = JSON.parse(localStorage.getItem("user"));
  const project = JSON.parse(localStorage.getItem("selectedProject"));
   const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (project?.id) {
      fetchBugs(project.id);
      fetchTeamMembers(project.id);
    }
  }, []);

  const fetchBugs = async (projectId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/bugs/${projectId}`,
        {
          data: { user_id: user.id },
        }
      );
      setBugs(res.data);
    } catch (error) {
      console.error("Error fetching bugs:", error);
    }
  };

  const fetchTeamMembers = async (projectId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/projects/${projectId}/members`
      );
      setTeam(res.data);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
     const response= await axios.post(
        `${API_URL}/api/projects/${project.id}/invite`,
        {
          owner_id: user.id,
          invite_email: inviteEmail,
          project_id: project.id,
        }
      );
      setFlash(response.data.message);
      fetchTeamMembers(project.id);
      setShowInviteModal(false);
      setInviteEmail("");
      setTimeout(() => {
      setFlash("");
    }, 3000);
    } catch (err) {
      const error = err.response?.data?.error;
      if (error === "User not found") {
        setShowRegisterInviteModal(true);
      } else {
        alert(error || "Invite failed");
      }

      console.error(err);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove member?")) return;
    try {
      await axios.post(
        `${API_URL}/api/projects/${project.id}/remove`,
        {
          owner_id: user.id,
          remove_user_id: memberId,
        }
      );
      fetchTeamMembers(project.id);
    } catch (err) {
      alert(err.response?.data?.error || "Remove failed");
      console.error(err);
    }
  };

  const handleDeleteBug = async (bugId) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;
    try {
      await axios.delete(`${API_URL}/api/bugs/${bugId}`);
      fetchBugs(project.id); // refresh the list
    } catch (error) {
      console.error("Error deleting bug:", error);
      alert("Failed to delete bug.");
    }
  };

  const handleAddBug = async (e) => {
    e.preventDefault();
    const { title, description, status, priority, assignee } = e.target;
    try {
      await axios.post(`${API_URL}/api/bugs/create`, {
        title: title.value,
        status: status.value,
        priority: priority.value,
        assignee: assignee.value,
        description: description.value,
        project_id: project.id,
      });
      fetchBugs(project.id);
    } catch (err) {
      console.error("Error creating bug:", err);
      alert("Could not create bug.");
    }
    setShowModal(false);
  };

  const matchFilter = (bug) =>
    (filterStatus === "All" || bug.status === filterStatus) &&
    (filterPriority === "All" || bug.priority === filterPriority);

  return (
    <AppLayout>
         
         <div className="dashboard">
        <div className="dashboard-header">
          <h2> {project.title} Bugs</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add Bug
          </button>
        </div>

        <div className="filters">
          <label>Filter:</label>
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            value={filterPriority}
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
       
        <div className="bug-list">
          {bugs.filter(matchFilter).map((bug) => (
            <div key={bug.id} className="bug-card">
              <div className="bug-header" >
              <div >{bug.title}</div>
              <div>
              <button
                className="delete-btn"
                title="Delete Bug"
                onClick={() => handleDeleteBug(bug.id)}
              >
               🗑️
              </button></div></div>
              <div className="bug-description">Problem: {bug.description}</div>
              <div className="bug-tags">
                <div>
                <span className="status" >
                  {bug.status}
                </span>
                <span className="priority">{bug.priority}</span></div>
                <div><span className="avatar"><span className="avatar_name">Assigned to:</span> {bug.assignee}</span></div>
              </div>
            </div>
            
          ))}
        </div>
        </div>
      
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add New Bug</h3>
              <form onSubmit={handleAddBug}>
                <input name="title" placeholder="Bug Title" required />
                <input
                  name="description"
                  placeholder="Description"
                  type="text"
                  required
                />
                <select name="status">
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
                <select name="priority">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select name="assignee">
                  {" "}
                  {team.map((member) => (
                    <option key={member.id}>{member.username} </option>
                  ))}
                </select>
                <button type="submit">Add</button>
              </form>
            </div>
          </div>
        )}
        
        <div className="team-section">
          <h3>👥 Team Members</h3>
         
             {project.user_id === user.id && (
            <button
              className="invite-btn"
              onClick={() => setShowInviteModal(true)}
            >
              + Invite Member
            </button>
          )}
          {flash && (
        <div className='flash'>
          {flash}
        </div>
      )}
          <div className="team-list">
            
            {team.map((member) => (
              <div className="member" key={member.id}>
                <div>username:{" "}{member.username}{" "}</div><div>{" "}Email:{" "}{member.email}{" "}</div>
                {member.role === "owner" && <strong>• Owner</strong>}
                {project.user_id === user.id && member.id !== user.id && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(member.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
         
        </div>
      
      {showInviteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowInviteModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Invite Team Member</h3>
            <form onSubmit={handleInvite}>
              <input
                type="email"
                placeholder="Enter user email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <button type="submit">Send Invite</button>
            </form>
          </div>
        </div>
      )}
      {showRegisterInviteModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowInviteModal(false);
            setShowRegisterInviteModal(false);
            setInviteEmail("");
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Not Found</h3>
            <p>
              The user with email <strong>{inviteEmail}</strong> doesn't have an
              account.
            </p>
            <p>Invite them to join using the link below:</p>
            <input
              type="text"
              readOnly
              value={inviteLink}
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                alert("Invite link copied to clipboard!");
              }}
            >
              Copy Invite Link
            </button>
            <button
              className="btn"
              onClick={() => {
                setShowInviteModal(false);
                setShowRegisterInviteModal(false);
                setInviteEmail("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
