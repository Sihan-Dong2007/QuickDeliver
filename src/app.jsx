import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import logo from './logo.png';
import './index.css';

export default function App() {
  return (
    <div className="body bg-light text-dark">
      {/* ===== Header / Navbar ===== */}
      <header className="container-fluid">
        <nav className="navbar fixed-top navbar-light bg-light">
          <div className="navbar-brand">
            Quick Delivery<sup>&reg;</sup>
          </div>

          <menu className="navbar-nav flex-row gap-3">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Food Choices
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                View Order
              </a>
            </li>
          </menu>
        </nav>
      </header>

      {/* ===== Main Content ===== */}
      <main className="container text-center mt-5 pt-5">
        App components go here.
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-light text-muted mt-5">
        <div className="container-fluid text-center py-3">
          <span className="text-reset">Sihan Dong</span>
          <br />
          <a
            className="text-reset"
            href="https://github.com/Sihan-Dong2007/QuickDeliver"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}