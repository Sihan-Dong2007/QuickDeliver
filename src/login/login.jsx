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
    <main className="container d-flex justify-content-center align-items-center py-5">
      <h1>Welcome to Quick Delivery</h1>

      <form method="get" action="/choices">
        <div>
          <span>Store</span>
          <input
            type="text"
            placeholder="your store's name"
          />
        </div>

        <div>
          <span>🔒</span>
          <input
            type="password"
            placeholder="password"
          />
        </div>

        <button type="submit">Login</button>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}