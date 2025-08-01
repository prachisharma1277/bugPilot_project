import React from "react";
import "./Header.css";
import { useLocation } from "react-router-dom";
import profileImg from "../assets/profile.png";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user")); // get user from localStorage
  const navigate = useNavigate();
  const toggleAccountMenu = () => {
    setAccountOpen(!accountOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="blog">
       <button className="burger" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="logo">🐞 BugPilot</div></div>
      <div
        className={`account-wrapper ${accountOpen ? "active" : ""}`}
        ref={accountRef}
      >
        <button
          onClick={toggleAccountMenu}
          className={`account-btn ${accountOpen ? "active" : ""}`}
        >
          <img
            src={profileImg} // Replace with your avatar or keep a default placeholder
            alt="User"
            className="avatar-icon"
          />
        </button>

        {accountOpen && user && (
          <div className="account-dropdown">
            <div className="account"> 
              <div className="account_space">
              <img  src={profileImg} // Replace with your avatar or keep a default placeholder
            alt="User"
            className="avatar-icon"
          /> 
          </div>
          <div>
            <p>
              <strong> {user.username}</strong>
            </p>
            <p> {user.email}</p>
            </div>
            </div>
            <hr />
            <button className="dropdown-btn">Settings</button>
            <button className="dropdown-btn">Help</button>
            <button
              className="dropdown-btn"
              onClick={() => {
                localStorage.clear();
               navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
     
    </header>
  );
};

export default Header;
