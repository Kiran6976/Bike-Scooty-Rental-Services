import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Stripe from "react-stripe-checkout";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../App";

const Mycart = () => {
  const { state } = useContext(UserContext);

  
  const [items, setItems] = useState([]);

  // 🔹 Fetch cart data
  const getCartData = async () => {
    try {
      const data = await apiFetch("/getCartData", {
        method: "GET",
      });

      
      setItems(data.cartItems);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  // 🔹 Calculate total price
  const itemsPrice = items.reduce(
    (total, item) => total + Number(item.price || 0),
    0
  );

  // 🔹 Handle Stripe payment
  const handlePayMethod = async (token) => {
    try {
      await apiFetch("/stripePay", {
        method: "POST",
        body: JSON.stringify({
          token: token.id,
          amount: itemsPrice,
        }),
      });

      await updateDataBase();
      alert("Payment successful");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  // 🔹 Update database after payment
  const updateDataBase = async () => {
    return apiFetch("/updateDataBase", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  };

  // 🔹 Delete item from cart
  const deleteItem = async (e) => {
    const cartitemid = e.currentTarget.id;

    try {
      await apiFetch("/deleteitemfromcart", {
        method: "POST",
        body: JSON.stringify({ cartitemid }),
      });

      // refresh cart after delete
      setItems((prev) => prev.filter((item) => item._id !== cartitemid));
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  // 🔹 Login / Logout button
  const Loginbutton = () => {
    if (state) {
      return (
        <button>
          <NavLink className="btn" to="/signout">
            logout
          </NavLink>
        </button>
      );
    }

    return (
      <button>
        <NavLink className="btn" to="/signin">
          login
        </NavLink>
      </button>
    );
  };

  return (
    <>
      {/* HEADER */}
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

      {/* CART */}
      <div className="salecartMaindiv">
        <div style={{ marginTop: "150px" }}>
          {items.length === 0 ? (
            <h3 style={{ textAlign: "center" }}>Your cart is empty</h3>
          ) : (
            items.map((item) => (
              <div className="salecartLidiv" key={item._id}>
                <ul>
                  <li style={{ wordSpacing: "10px" }}>
                    Brand: {item.brand} — Model: {item.model} — Quantity:{" "}
                    {item.quantity} — Price: {item.price} Taka
                    <button
                      id={item._id}
                      onClick={deleteItem}
                      className="btn"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </li>
                </ul>
              </div>
            ))
          )}

          {/* PAYMENT */}
          {items.length > 0 && (
            <div style={{ padding: "30px", textAlign: "center" }}>
              <h2>Pay Through Credit / Debit Card</h2>
              <br />

              <Stripe
                stripeKey="pk_test_51Jyb5UBvc4Qazj8jy6qimLop4epxe5jziUD3ixj5ISycjjD6yYVGZhk688Pz9Lna32VTHbSHxRwkrvNNnnnr96P000M68u5jcd"
                token={handlePayMethod}
                amount={itemsPrice * 100}
                currency="INR"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Mycart;
