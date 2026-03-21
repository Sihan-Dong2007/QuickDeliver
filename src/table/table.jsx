import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';

export function Table({ orders }) { // 接收 App.jsx 传过来的 orders
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');

  const [initialOrders, setInitialOrders] = useState([]); // 用于第一次加载后端已有订单

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders', {
          credentials: 'include', // 发送 cookie
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.msg || 'Failed to fetch orders.');
          return;
        }

        const data = await res.json();
        setInitialOrders(data); // 初始化已有订单
      } catch (err) {
        setError('Failed to fetch orders. Server error.');
      }
    }

    fetchOrders();

    // 获取每日 quote
    fetch('https://quote.cs260.click')
      .then((res) => res.json())
      .then((data) => setQuote({ text: data.quote, author: data.author }))
      .catch(() => setQuote({ text: 'Could not load quote.', author: 'System' }));
  }, []);

  if (error) {
    return (
      <main className="container py-5 text-center">
        <h2>Error</h2>
        <p>{error}</p>
      </main>
    );
  }

  const allOrders = [...initialOrders, ...(orders || [])]; // 合并初始订单 + WebSocket 新订单

  if (!allOrders.length) {
    return (
      <main className="container py-5 text-center">
        <h2>No orders found.</h2>
      </main>
    );
  }

  const order = allOrders[allOrders.length - 1]; // 显示最新订单

  return (
    <main className="table-page container py-5">
      <div className="table-card">

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

        <hr />

        <div className="quote-section mt-4">
          <h4>Quote of the Day</h4>
          {quote && (
            <>
              <p className="quote-text">"{quote.text}"</p>
              <p className="quote-author">— {quote.author}</p>
            </>
          )}
        </div>

      </div>
    </main>
  );
}