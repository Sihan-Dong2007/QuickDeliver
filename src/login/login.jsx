import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../app.css";
import { useNavigate } from "react-router-dom";

export function Login({ setCurrentUser }) {
  const [store, setStore] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!store || !password) {
      setError("Please enter store and password");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store, password }),
        credentials: "include", // 发送 cookie
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Invalid store name or password");
        return;
      }

      // 登录成功
      setCurrentUser(data.store); // 前端状态保存
      navigate("/choices");
    } catch (err) {
      setError("Login failed. Server error.");
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center py-5">
      <h1 className="mb-4">Welcome to Quick Delivery</h1>

      <form onSubmit={handleLogin} className="w-50">

        <div className="mb-3">
          <label className="form-label">Store</label>
          <input
            type="text"
            className="form-control"
            placeholder="your store's name"
            value={store}
            onChange={(e) => setStore(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn-login w-50">
            Login
          </button>

          <button type="button" className="btn-login w-50" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>

      </form>
    </main>
  );
}