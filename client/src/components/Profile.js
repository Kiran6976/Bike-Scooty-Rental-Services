import React, { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { apiFetch } from "../utils/apiFetch";
const Profile = () => {
  const { state } = useContext(UserContext);
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* 🔐 Redirect if not logged in */
  useEffect(() => {
  if (!state) {
    history.push("/signin");
  }
}, [state, history]);


  /* 📦 apiFetch profile + orders */
  useEffect(() => {
    apiFetch("/myprofile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setOrders(data.orders);
      })
      .catch((err) => console.log(err));
  }, []);

  /* 🔑 Change password */
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await apiFetch("/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      alert("Password updated successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert(data.error || "Password update failed");
    }
  };

  const Loginbutton = () => (
    <button>
      <NavLink className="btn" to="/signout">
        Logout
      </NavLink>
    </button>
  );

  return (
    <>
      {/* 🔝 NAVBAR */}
      <header className="header">
        <div id="menu-btn" className="fas fa-bars"></div>

        <NavLink className="logo" to="/">
          Bike<span>Book</span>
        </NavLink>

        <nav className="navbar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/rentbike">Rent Bikes</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <a href="/#services">Testimonial</a>
          <a href="/#contact">Contact</a>
        </nav>

        <div id="login-btn">
          <Loginbutton />
        </div>
      </header>

      {/* 👤 PROFILE DETAILS */}
      <section className="contact" style={{ marginTop: "110px" }}>
        <h1 className="heading">
          <span>My</span> Profile
        </h1>

        {user && (
          <div className="row">
            <form>
              <h3>User Details</h3>

              <input className="box" value={user.name} readOnly />
              <input className="box" value={user.email} readOnly />
              <input className="box" value={user.phone} readOnly />
            </form>
          </div>
        )}
      </section>

      {/* 🔑 CHANGE PASSWORD */}
      <section className="contact">
        <h1 className="heading">
          <span>Change</span> Password
        </h1>

        <div className="row">
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              className="box"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, oldPassword: e.target.value })
              }
              required
            />

            <input
              type="password"
              className="box"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              required
            />

            <input
              type="password"
              className="box"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />

            <input type="submit" className="btn" value="Update Password" />
          </form>
        </div>
      </section>

      {/* 📜 ORDER HISTORY */}
      <section className="services">
        <h1 className="heading">
          <span>Order</span> History
        </h1>

        <div className="box-container">
          {orders.length === 0 ? (
            <p style={{ textAlign: "center" }}>No orders found</p>
          ) : (
            orders.map((order) =>
              order.cartItems.map((item, index) => (
                <div className="box" key={index}>
                  <h3>
                    {item.brand} {item.model}
                  </h3>
                  <p>
                    <strong>Hours:</strong> {item.requiredhours}
                  </p>
                  <p>
                    <strong>Total Bill:</strong> ₹{item.totalbill}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>
              ))
            )
          )}
        </div>
      </section>
    </>
  );
};

export default Profile;
