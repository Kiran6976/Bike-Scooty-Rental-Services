import React, { useState, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import apiFetch from "../utils/apiFetch";
import { AdminContext } from "../App";

const AdminSignin = () => {
  const { dispatchadmin } = useContext(AdminContext);
  const history = useHistory();

  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const signinAdmin = async (e) => {
    e.preventDefault();

    try {
      // apiFetch already returns parsed JSON
      const data = await apiFetch("/signinAdmin", {
        method: "POST",
        body: JSON.stringify({
          adminName,
          adminPassword,
        }),
      });
      console.log(data);

      dispatchadmin({ type: "ADMIN", payload: true });
      window.alert("Signin Successful");
      history.push("/dashboard");

    } catch (err) {
      window.alert(err.message || "Invalid credentials");
      console.error(err.message);
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
          <NavLink className="nav-link" to="/">Home</NavLink>
          <a href="/#contact">Contact</a>
        </nav>

        <div id="login-btn">
          <button className="btn">
            <NavLink className="nav-link" to="/signin">
              Login
            </NavLink>
          </button>
        </div>
      </header>

      <div className="maincontainer">
        <div className="firstcontainer">
          <div className="content" id="adminsignin">
            <h2>Signin As Admin</h2>

            <form onSubmit={signinAdmin}>
              <div className="user-details">
                <div className="input-box">
                  <span className="details">User Name</span>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter your user name"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Password</span>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="button">
                <input type="submit" value="signin" />
              </div>
            </form>

            <button className="btn">
              <NavLink className="nav-link" to="/signin">
                Signin As User
              </NavLink>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSignin;
