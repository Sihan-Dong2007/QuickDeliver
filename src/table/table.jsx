import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';



export function Table() {
  return (
    <main className="container d-flex justify-content-center align-items-center py-5">
      <div className="card-container w-100">

        <h2>You are signed in as:</h2>
        <p>Store Name</p>

        <hr />

        <h2>Order Information</h2>
        <hr />

        <table className="table table-borderless text-light text-center">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Store Name</th>
              <th>Delivery Time</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#0001</td>
              <td>01Store</td>
              <td>-- minutes</td>
            </tr>
            <tr>
              <td>#0002</td>
              <td>02Store</td>
              <td>-- minutes</td>
            </tr>
            <tr>
              <td>#0003</td>
              <td>03Store</td>
              <td>-- minutes</td>
            </tr>
          </tbody>
        </table>

        <section className="mt-4">
          <h2>Quote of the Day</h2>
          <hr />
          <p>“a randomly fetched quote from a third-party API.”</p>
          <p>— Author</p>
        </section>

      </div>
    </main>
  );
}