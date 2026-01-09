import React, { useState, useEffect } from "react";
import "../registerStyle.css";
import { NavLink, useHistory } from "react-router-dom";
import apiFetch  from "../utils/apiFetch";

const Signup = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ⏱ OTP TIMER
  useEffect(() => {
    if (!showOtp) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    setCanResend(true);
  }, [timer, showOtp]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // 🔹 SIGNUP → SEND OTP
  const postData = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, phone, email, password, cPassword } = user;

    try {
      const data = await apiFetch("/signup", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          cPassword,
        }),
      });

      console.log("Signup response:", data);
      window.alert("OTP sent to your email");

      setShowOtp(true);
      setTimer(60);
      setCanResend(false);

    } catch (err) {
      window.alert(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch("/verify-email-otp", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          otp,
        }),
      });

      console.log("OTP verified:", data);
      window.alert("Email verified successfully");

      history.push("/signin");

    } catch (err) {
      window.alert(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 RESEND OTP
  const resendOtp = async () => {
    setLoading(true);

    try {
      await apiFetch("/signup", {
        method: "POST",
        body: JSON.stringify(user),
      });

      window.alert("OTP resent successfully");
      setTimer(60);
      setCanResend(false);

    } catch (err) {
      window.alert(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
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

      {/* SIGNUP FORM */}
      <div className="maincontainer">
        <div className="firstcontainer">
          <div className="titled">
            {showOtp ? "Verify Email" : "Registration"}
          </div>

          <div className="content">
            <form method="POST">

              {/* 🔐 SIGNUP FORM */}
              {!showOtp ? (
                <>
                  <div className="user-details">
                    <div className="input-box">
                      <span className="details">Full Name</span>
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputs}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="input-box">
                      <span className="details">Email</span>
                      <input
                        type="text"
                        name="email"
                        value={user.email}
                        onChange={handleInputs}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="input-box">
                      <span className="details">Phone Number</span>
                      <input
                        type="text"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputs}
                        placeholder="Enter your number"
                      />
                    </div>

                    <div className="input-box">
                      <span className="details">Password</span>
                      <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleInputs}
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="input-box">
                      <span className="details">Confirm Password</span>
                      <input
                        type="password"
                        name="cPassword"
                        value={user.cPassword}
                        onChange={handleInputs}
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  <div className="button">
                    <input
                      type="submit"
                      value={loading ? "Sending OTP..." : "Register"}
                      onClick={postData}
                      disabled={loading}
                    />
                  </div>
                </>
              ) : (
                /* 🔐 OTP VERIFICATION */
                <>
                  <div className="user-details">
                    <div className="input-box">
                      <span className="details">Enter OTP</span>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit OTP"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* ⏱ TIMER */}
                  <p style={{ textAlign: "center", marginTop: "10px" }}>
                    {timer > 0
                      ? `Resend OTP in ${timer}s`
                      : "Didn't receive OTP?"}
                  </p>

                  <div className="button">
                    <input
                      type="submit"
                      value={loading ? "Verifying..." : "Verify OTP"}
                      onClick={verifyOtp}
                      disabled={loading}
                    />
                  </div>

                  {/* 🔁 RESEND BUTTON */}
                  <div className="button">
                    <input
                      type="button"
                      value="Resend OTP"
                      onClick={resendOtp}
                      disabled={!canResend || loading}
                    />
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
