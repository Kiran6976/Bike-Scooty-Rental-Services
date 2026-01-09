import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const data = location.state;

  return (
    <div style={{ marginTop: "150px", textAlign: "center" }}>
      <h1 style={{ color: "green" }}>✅ Booking Confirmed</h1>

      <p>Your payment was successful.</p>

      {data && (
        <div style={{ marginTop: "20px" }}>
          <p><b>Payment ID:</b> {data.paymentId}</p>
          <p><b>Order ID:</b> {data.orderId}</p>
          <p><b>Amount Paid:</b> ₹{data.amount}</p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <NavLink to="/myprofile">
          <button className="btn">Go to Profile</button>
        </NavLink>

        <NavLink to="/">
          <button className="btn" style={{ marginLeft: "15px" }}>
            Home
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default BookingConfirmation;
