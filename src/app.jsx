import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { SignUp } from './signup/signup';
import { Choices } from './choices/choices';
import { Table } from './table/table';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // 保存当前登录商店名

  return (
    <BrowserRouter>
      <div className="body">
        <header className="container-fluid">
          <nav className="navbar navbar-dark">
            <div className="navbar-brand d-flex align-items-center gap-2">
              <img src="/logo.png" alt="Quick Delivery Logo" className="logo" />
              <span>Quick Delivery<sup>&reg;</sup></span>
            </div>

            <menu className="navbar-nav flex-row gap-3">
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
            </menu>

            {currentUser && (
              <div className="text-light">
                Logged in as: <strong>{currentUser}</strong>
              </div>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/choices" element={<Choices currentUser={currentUser} />} />
          <Route path="/table" element={<Table currentUser={currentUser} />} />
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
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}