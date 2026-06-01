import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <Header />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

export default Layout;
