import React from "react";
import Navbar from "../nav/Navbar";

import "./layout.css";
const MainHeader = ({ children }) => {
  return (
    <header className="main-header">
      <Navbar />
    </header>
  );
};

export default MainHeader;
