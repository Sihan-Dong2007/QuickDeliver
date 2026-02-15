import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function Login() {
  const [store, setStore] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.store === store && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', store);
      setError('');
      navigate('/choices');
    } else {
      setError('Store name or password is incorrect. Please Sign Up if you are new.');
    }
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

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <button
          type="button"
          className="btn btn-secondary w-100 mt-2"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
