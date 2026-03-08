import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';

export function Table() {
  const [order, setOrder] = useState(null);
  const [store, setStore] = useState('');
  const [quote, setQuote] = useState(null);

  useEffect(() => {

    const savedStore = localStorage.getItem('store');

    if (savedStore) {
      setStore(savedStore);
    }

    // 从 backend 获取订单
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setOrder(data[data.length - 1]); // 显示最新订单
        }
      })
      .catch(() => {
        console.log("Could not load orders");
      });

    // quote API
    fetch('https://quote.cs260.click')
      .then((response) => response.json())
      .then((data) => {
        setQuote({
          text: data.quote,
          author: data.author
        });
      })
      .catch(() => {
        setQuote({
          text: "Could not load quote.",
          author: "System"
        });
      });

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