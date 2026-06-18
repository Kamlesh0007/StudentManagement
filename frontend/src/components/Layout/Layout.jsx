import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";
import Overlay from "./Overlay";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Overlay
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-content">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="page-content">
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;