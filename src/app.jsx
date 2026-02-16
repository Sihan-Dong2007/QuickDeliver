import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { SignUp } from './signup/signup';
import { Choices } from './choices/choices';
import { Table } from './table/table';

export default function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("store") || null);

  return (
    <BrowserRouter>
      <AppContent currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </BrowserRouter>
  );
}

function AppContent({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("store");
    localStorage.removeItem("users");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="body">
      <header className="container-fluid">
        <nav className="navbar navbar-dark w-100">

          {/* 左边 Logo */}
          <div className="navbar-brand d-flex align-items-center gap-2">
            <img src="/logo.png" alt="Quick Delivery Logo" className="logo" />
            <span>Quick Delivery<sup>&reg;</sup></span>
          </div>

          {/* 中间导航 */}
          <menu className="navbar-nav flex-row gap-3 mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Login
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/signup">
                Sign Up
              </NavLink>
            </li>

            {currentUser && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/choices">
                    Food Choices
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/table">
                    View Order
                  </NavLink>
                </li>
              </>
            )}
          </menu>

          {/* 右侧用户信息 + Logout */}
          {currentUser && (
            <div className="d-flex align-items-center gap-3 ms-4">
              <span className="text-light">
                Logged in as: <strong>{currentUser}</strong>
              </span>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/choices"
          element={
            currentUser ? (
              <Choices currentUser={currentUser} />
            ) : (
              <Login setCurrentUser={setCurrentUser} />
            )
          }
        />

        <Route
          path="/table"
          element={
            currentUser ? (
              <Table currentUser={currentUser} />
            ) : (
              <Login setCurrentUser={setCurrentUser} />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="mt-5">
        <div className="container-fluid text-center py-3">
          <span className="text-reset">Sihan Dong</span>
          <br />
          <NavLink
            className="text-reset"
            to="https://github.com/Sihan-Dong2007/QuickDeliver"
          >
            GitHub
          </NavLink>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
