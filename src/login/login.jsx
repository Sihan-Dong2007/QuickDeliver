import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';



export function Login() {
  const navigate = useNavigate();

  const [store, setStore] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedStore = localStorage.getItem('storeName');
    if (savedStore) {
      setStore(savedStore);
    }
  }, []);

  function handleLogin(event) {
    event.preventDefault();

    if (!store || !password) {
      setError('Please enter store name and password.');
      return;
    }

    localStorage.setItem('storeName', store);

    setError('');
    
    navigate('/choices');
  }


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
      </form>
    </main>
  );
}