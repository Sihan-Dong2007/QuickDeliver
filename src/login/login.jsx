import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Login() {
  return (
    <main>
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