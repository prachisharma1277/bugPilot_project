// src/pages/About.jsx
import React from "react";
import AppLayout from "../components/AppLayout";
import "./AboutPage.css";
export default function AboutPage() {
  return (
    <AppLayout>
      <div className="main-content">
        <h1>About Our Project</h1>
        <p>
          Welcome to BugTrackr, your smart bug-tracking and project collaboration platform!
          Our tool helps teams efficiently report, manage, and resolve bugs in real-time.
          With intuitive UI, role-based access, and team collaboration features, it’s ideal for software teams of all sizes.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li>🪲 Easy bug reporting and status tracking</li>
          <li>👥 Team member invitations & role management</li>
          <li>📂 Project-wise organization</li>
          <li>📊 Filter bugs by status, priority, and assignee</li>
        </ul>

        <h2>User Reviews</h2>
        <div className="reviews">
          <blockquote>
            “This tool has streamlined our QA process. We spot bugs, assign them, and track progress all in one place!”  
            <footer>— Aarti Joshi, QA Lead</footer>
          </blockquote>
          <blockquote>
            “Love the minimal design and how easy it is to manage my development team's workload.”  
            <footer>— Rohit Mehra, Software Engineer</footer>
          </blockquote>
          <blockquote>
            “No more endless Slack messages about bugs — this has saved us hours every sprint.”  
            <footer>— Divya Patel, Product Manager</footer>
          </blockquote>
        </div>
      </div>
    </AppLayout>
  );
}
