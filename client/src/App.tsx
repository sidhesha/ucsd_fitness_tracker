import React from 'react';
import {matchPath, Navigate, Route, Routes, useLocation} from 'react-router-dom'
import './App.css';
import Main from './Main';
import Login from "./Login";

function App() {
  const login = localStorage.getItem("login") === "1";
  const location = useLocation();
  return (
    <div className="App">
      {(login && !matchPath("/main/*", location.pathname)) && (
        <Navigate to="/main" />
      )}
      {(!login && !matchPath("/login", location.pathname)) && (
        <Navigate to="/login" />
      )}
      <Routes>
        {login && <Route path="/main/*" element={<Main />} />}
        {!login && <Route path="/login" element={<Login />} />}
      </Routes>
    </div>
  );
}

export default App;
