import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { SignUp } from './signup/signup';
import { Choices } from './choices/choices';
import { Table } from './table/table';

export default function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("store") || null);
  const [orders, setOrders] = useState([]); // 新增订单状态用于 WebSocket

  // WebSocket 连接
  useEffect(() => {
    if (!currentUser) return; // 未登录不连接

    const socket = new WebSocket(`ws://${window.location.hostname}:4000`);

    socket.onopen = () => console.log("WebSocket connected");

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "new_order") {
        setOrders(prev => [...prev, msg.data]); // 新订单加入 orders 状态
      }
    };

    socket.onclose = () => console.log("WebSocket disconnected");

    return () => socket.close();
  }, [currentUser]);

  return (
    <BrowserRouter>
      <AppContent 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        orders={orders} // 传递给 Table 页面
      />
    </BrowserRouter>
  );
}

function AppContent({ currentUser, setCurrentUser, orders }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'DELETE' });

    localStorage.removeItem("store");
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
              <Table currentUser={currentUser} orders={orders} />
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