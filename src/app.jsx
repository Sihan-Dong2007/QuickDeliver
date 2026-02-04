import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Choices } from './choices/choices';
import { Table } from './table/table';



export default function App() {
  return (
    <BrowserRouter>
    <div className="body">
      <header className="container-fluid">
        <nav className="navbar navbar-dark">
          <div className="navbar-brand d-flex align-items-center gap-2">
            <img src="/logo.png" alt="Quick Delivery Logo" className="logo" />
            <span>
                Quick Delivery<sup>&reg;</sup>
            </span>
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


      <main className="container text-center mt-5 pt-5">
        App components go here.
      </main>


      <footer className="mt-5">
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
    </BrowserRouter>
  );
}