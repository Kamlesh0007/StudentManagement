import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Header({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/students", label: "Student List" },
    { path: "/students/add", label: "Add Student" },
    { path: "/logs", label: "Activity Logs" },
  ];

  const isActive = (path) => location.pathname === path;

  const pageTitle =
    navItems.find((item) => isActive(item.path))?.label ||
    "Student Management";

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h1 className="topbar-title">{pageTitle}</h1>
      </div>

      <div className="topbar-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/students/add")}
        >
          ➕ Add Student
        </button>
      </div>
    </header>
  );
}

export default Header;