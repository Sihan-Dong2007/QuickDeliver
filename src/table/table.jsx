import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';

export function Table() {
  const [order, setOrder] = useState(null);
  const [store, setStore] = useState('');
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // 获取已保存的订单和商店名
    const savedOrder = localStorage.getItem('order');
    const savedStore = localStorage.getItem('store');

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }

    if (savedStore) {
      setStore(savedStore);
    }

    // 随机名言列表
    const quotes = [
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
      { text: "Make it work, make it right, make it fast.", author: "Kent Beck" }
    ];

    // 随机选择一句
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  // 如果没有订单
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
