import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './choices.css';

export function Choices() {
  const navigate = useNavigate();

  const [food, setFood] = useState('');
  const [weather, setWeather] = useState('');
  const [transportTime, setTransportTime] = useState('');

  useEffect(() => {
    if (food && weather) {
      let base = 20;

      if (weather === 'Hot & Humid') base += 10;
      if (weather === 'Cold & Dry') base += 5;
      if (weather === 'Plum Rain Season') base += 15;

      setTransportTime(`${base} minutes`);
    }
  }, [food, weather]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!food || !weather) {
      alert('Please select food and weather.');
      return;
    }

    const order = { food, weather, transportTime };
    localStorage.setItem('order', JSON.stringify(order));

    navigate('/table');
  }

  return (
    <main className="choices-page container d-flex justify-content-center py-5">
      <form onSubmit={handleSubmit} className="choices-form">

        <h2>Food Choices</h2>
        <hr />

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="food"
            value="Shrimp & Water Chestnut Mini Wontons"
            onChange={(e) => setFood(e.target.value)}
          />
          <label className="form-check-label">
            Shrimp & Water Chestnut Mini Wontons
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="food"
            value="Fragrant Hot Pot Bullfrog"
            onChange={(e) => setFood(e.target.value)}
          />
          <label className="form-check-label">
            Fragrant Hot Pot Bullfrog
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="food"
            value="Pan-fried Pork Bun"
            onChange={(e) => setFood(e.target.value)}
          />
          <label className="form-check-label">
            Pan-fried Pork Bun
          </label>
        </div>

        <h2 className="mt-4">Weather Choices</h2>
        <hr />

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="weather"
            value="Hot & Humid"
            onChange={(e) => setWeather(e.target.value)}
          />
          <label className="form-check-label">
            Hot & Humid
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="weather"
            value="Cold & Dry"
            onChange={(e) => setWeather(e.target.value)}
          />
          <label className="form-check-label">
            Cold & Dry
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="weather"
            value="Plum Rain Season"
            onChange={(e) => setWeather(e.target.value)}
          />
          <label className="form-check-label">
            Plum Rain Season
          </label>
        </div>

        <div className="mt-4">
          <label className="form-label">
            Estimated Transport Time:
          </label>
          <input
            type="text"
            className="form-control"
            value={transportTime}
            readOnly
          />
        </div>

        <button type="submit" className="confirm-btn mt-4">
          Confirm
        </button>

      </form>
    </main>
  );
}
