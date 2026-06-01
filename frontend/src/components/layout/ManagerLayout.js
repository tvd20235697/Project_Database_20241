import React from "react";
import ManagerHeader from "./ManagerHeader";

const ManagerLayout = ({ children }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <ManagerHeader />
    <main style={{ flex: 1, background: "var(--bg)", padding: "24px 0" }}>
      <div className="container">{children}</div>
    </main>
  </div>
);

export default ManagerLayout;
