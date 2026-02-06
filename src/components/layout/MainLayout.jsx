import React from "react";
import MainContainer from "./MainContainer";
import MainContent from "./MainContent";
import MainHeader from "./MainHeader";
import Navbar from "../nav/Navbar";
import "./layout.css";
const MainLayout = ({ children }) => {
  return (
    <MainContainer>
      <MainHeader>
        <Navbar />
      </MainHeader>
      {children}
    </MainContainer>
  );
};

export default MainLayout;
