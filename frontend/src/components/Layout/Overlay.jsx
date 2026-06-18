import React from "react";

function Overlay({ sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`overlay ${sidebarOpen ? "show" : ""}`}
      onClick={() => setSidebarOpen(false)}
    />
  );
}

export default Overlay;