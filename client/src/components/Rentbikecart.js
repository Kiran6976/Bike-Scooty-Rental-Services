import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";
import { UserContext } from "../App";

const Rentbikecart = () => {
  const { state } = useContext(UserContext);

  const [cartUser, setCartUser] = useState([]);
  const [items, setItems] = useState([]);

  let idOfRentedBike, reqHours;

  const getCartData = async () => {
    try {
      const data = await apiFetch("/getRentCartData", {
        method: "GET",
      });

      setCartUser(data.userById);
      setItems(data.cartItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  // keep your old mapping logic (used elsewhere)
  items.map((items) => {
    idOfRentedBike = items.rentbikeid;
    reqHours = items.requiredhours;
  });

  const updateDataBase = () => {
    return apiFetch("/updateRentDataBase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
      }),
    });
  };

  const Loginbutton = () => {
    if (state) {
      return (
        <div>
          <button>
            <NavLink className="btn" to="/signout">
              logout
            </NavLink>
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button>
            <NavLink className="btn" to="/signin">
              login
            </NavLink>
          </button>
        </div>
      );
    }
  };

  let rentCartItemId;

  const deleteRentItem = (e) => {
    rentCartItemId = e.target.closest("button").id;

    return apiFetch("/deleteRentCartItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rentCartItemId,
      }),
    })
      .then(() => {
        setItems(items.filter((item) => item._id !== rentCartItemId));
      })
      .catch((err) => console.log(err));
  };

  // 🔥 Razorpay only (Stripe removed)
  const loadRazorpay = async () => {
    try {
      const totalAmount = items.reduce(
        (sum, i) => sum + i.totalbill,
        0
      );

      const order = await apiFetch("/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const options = {
        key: "rzp_test_S1eaqKUxLQblwx", // replace with real key_id
        amount: order.amount,
        currency: "INR",
        name: "BikeBook",
        description: "Bike Rental Payment",
        order_id: order.id,

        handler: async function (response) {
  const verifyData = await apiFetch("/verify-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  });

  if (verifyData.success) {
    updateDataBase();

    window.location.href = "/booking-confirmation";
  } else {
    alert("Payment Verification Failed");
  }
},


        theme: {
          color: "#ff6a00",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <>
      <header className="header">
        <div id="menu-btn" className="fas fa-bars"></div>
        <NavLink className="logo" to="/">
          <span>Bike</span>Book
        </NavLink>

        <nav className="navbar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/rentbike">Rent Bikes</NavLink>
        </nav>

        <div id="login-btn">
          <Loginbutton />
        </div>
      </header>

      <div className="cart-container" style={{ marginTop: "150px" }}>
        {items.map((item) => (
          <div className="cart-card" key={item._id}>
            <div className="cart-info">
              <h3>
                {item.brand} {item.model}
              </h3>

              <div className="price-row">
                <span className="price-per-hour">
                  ₹{item.rentperhour} / hour
                </span>
                <span className="hours-badge">
                  {item.requiredhours} hour(s)
                </span>
              </div>
            </div>

            <div className="cart-price">
              <h2>₹{item.totalbill}</h2>
              <button
                className="delete-btn"
                id={item._id}
                onClick={deleteRentItem}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </div>
        ))}

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Total Items: {items.length}</p>

          <h2 className="total">
            ₹{items.reduce((sum, i) => sum + i.totalbill, 0)}
          </h2>

          <p className="trust-text">
            ✔ Secure Payment <br />
            ✔ No hidden charges
          </p>

          <button
            className="pay-btn"
            onClick={loadRazorpay}
            disabled={!items.length}
          >
            Pay Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Rentbikecart;
