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
      let baseTime = 20;

      if (weather === 'Hot & Humid') baseTime += 10;
      if (weather === 'Cold & Dry') baseTime += 5;
      if (weather === 'Plum Rain Season') baseTime += 15;

      setTransportTime(`${baseTime} minutes`);
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
    <main className="container d-flex justify-content-center align-items-center py-5">
      <form id="choicesForm" action="/table" method="get">
        <h2>Food Choices</h2>
        <hr />

        <div>
          <input type="radio" id="food1" name="food" />
          <label htmlFor="food1">
            Shrimp & Water Chestnut Mini Wontons
          </label>
        </div>

        <div>
          <input type="radio" id="food2" name="food" />
          <label htmlFor="food2">
            Fragrant Hot Pot Bullfrog
          </label>
        </div>

        <div>
          <input type="radio" id="food3" name="food" />
          <label htmlFor="food3">
            Pan-fried Pork Bun
          </label>
        </div>

        <h2>Weather Choices</h2>
        <hr />

        <div>
          <input type="radio" id="weather1" name="weather" />
          <label htmlFor="weather1">Hot & Humid</label>
        </div>

        <div>
          <input type="radio" id="weather2" name="weather" />
          <label htmlFor="weather2">Cold & Dry</label>
        </div>

        <div>
          <input type="radio" id="weather3" name="weather" />
          <label htmlFor="weather3">Plum Rain Season</label>
        </div>

        <div style={{ marginTop: '30px' }}>
          <label htmlFor="transport">
            Estimated Transport Time:
          </label>
          <input
            type="text"
            id="transport"
            name="transport"
            placeholder="deliver time"
            readOnly
          />
        </div>

        <button type="submit">Confirm</button>
      </form>
    </main>
  );
}