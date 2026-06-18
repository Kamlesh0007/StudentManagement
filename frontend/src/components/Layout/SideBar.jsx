import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/students", label: "Student List", icon: "👥" },
    { path: "/students/add", label: "Add Student", icon: "➕" },
    { path: "/logs", label: "Activity Logs", icon: "📋" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">👨‍🎓</div>
        <div className="logo-text">Student Mgmt</div>
        <div className="logo-sub">v1.0</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>

        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 | All Rights Reserved</p>
      </div>
    </aside>
  );
}

export default Sidebar;