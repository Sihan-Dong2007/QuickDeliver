import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';

export function Table() {
  const [order, setOrder] = useState(null);
  const [store, setStore] = useState('');

  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('order');
    const savedStore = localStorage.getItem('store');

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }

    if (savedStore) {
      setStore(savedStore);
    }
  }, []);

  if (!order) {
    return (
      <main className="table-page container py-5 text-center">
        <h2>No order found.</h2>
        <p>Please go back and create an order.</p>
      </main>
    );
  }

  return (
    <main className="table-page container py-5">
      <div className="table-card">

        <h2>You are signed in as:</h2>
        <p>{store || 'Unknown Store'}</p>

        <hr />

        <h2>Order Information</h2>
        <hr />

        <table className="custom-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Weather</th>
              <th>Delivery Time</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{order.food}</td>
              <td>{order.weather}</td>
              <td>{order.transportTime}</td>
            </tr>
          </tbody>
        </table>

        <button
          className="clear-btn mt-4"
          onClick={() => {
            localStorage.removeItem('order');
            window.location.reload();
          }}
        >
          Clear Order
        </button>

      </div>
    </main>
  );
}