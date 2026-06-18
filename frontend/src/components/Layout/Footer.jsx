import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} Student Management System. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;