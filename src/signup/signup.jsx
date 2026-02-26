import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css'; 

import { useNavigate } from 'react-router-dom';

export function SignUp() {
  const [store, setStore] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!store || !password) {
      setError('Please fill in both store name and password.');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ store, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg);
        return;
      }

      alert('Sign Up successful! Please login.');
      navigate('/');
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center py-5">
      <h1 className="mb-4">Sign Up for Quick Delivery</h1>

      <form onSubmit={handleSignUp} className="w-50">

        <div className="mb-3">
          <label className="form-label">Store Name</label>
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

        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </main>
  );
}
