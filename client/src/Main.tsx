import Home from "./pages/Home";
import Menu from "./components/Menu";
import {matchPath, Navigate, Route, Routes, useLocation, useResolvedPath} from "react-router-dom";
import React from "react";
import Profile from "./pages/Profile";
import './Main.css';
import Workout from "./pages/Workout";
import Chat from "./pages/Chat";

function Main() {
  const location = useLocation();
  const path = useResolvedPath(".");
  return (
    <div className="Main">
      {(matchPath(path.pathname, location.pathname)) && (
        <Navigate to="home" />
      )}
      <div className="Main-header"></div>
      <div className="Main-body">
        <Routes>
          <Route path="home/*" element={<Home />} />
          <Route path="workout/*" element={<Workout />} />
          <Route path="chat/*" element={<Chat />} />
          <Route path="profile/*" element={<Profile />} />
        </Routes>
      </div>
      <Menu />
    </div>
  );
}

export default Main;
