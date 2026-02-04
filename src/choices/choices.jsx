import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './choices.css';



export function Choices() {
  return (
    <main>
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