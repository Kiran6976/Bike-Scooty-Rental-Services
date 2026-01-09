import React, { useState, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../App";

const Signin = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signinUser = async (e) => {
    e.preventDefault();

    try {
      const data = await apiFetch("/signin", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // update global auth state
      dispatch({ type: "USER", payload: true });

      window.alert("Signin successful");
      console.log("Signin success:", data);

      history.push("/");
    } catch (err) {
      window.alert(err.message);
      console.error("Signin error:", err.message);
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
          <NavLink to="/exploreRentBikes">Bike Showcase</NavLink>
        </nav>

        <div id="login-btn">
          <button className="btn">
            <NavLink className="nav-link" to="/signin">
              login
            </NavLink>
          </button>
        </div>
      </header>

      <div className="maincontainer">
        <div className="firstcontainer">
          <div className="content" id="usersignin">
            <h2>Signin As User</h2>

            {/* ✅ IMPORTANT: use onSubmit */}
            <form onSubmit={signinUser}>
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="button">
                <input type="submit" value="Signin" />
              </div>
            </form>

            <h3>
              Don’t have an account?{" "}
              <NavLink style={{ color: "#ff6a00" }} to="/signup">
                Create one
              </NavLink>
            </h3>

            <button className="btn">
              <NavLink style={{ color: "#ffffff" }} to="/adminsignin">
                Signin As Admin
              </NavLink>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
