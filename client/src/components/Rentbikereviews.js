import React, { useEffect, useState, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../App";

const Rentbikereviews = () => {
  const { state } = useContext(UserContext);
  const { bikeId } = useParams();

  const [bike, setBike] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  /* =========================
     FETCH BIKE + USER
  ========================== */
  const loadBike = async () => {
    const data = await apiFetch(
      `/rentbike/${bikeId}/reviews/data`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    setBike(data.findBike);
    setUser(data.findUser);
  };

  /* =========================
     FETCH REVIEWS
  ========================== */
  const loadReviews = async () => {
    const data = await apiFetch(
      `/rentbike/${bikeId}/reviews`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    setReviews(data.allReviews);
  };

  /* =========================
     SUBMIT REVIEW
  ========================== */
  const submitReview = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please write a review");
      return;
    }

    await apiFetch(`/rentbike/${bikeId}/reviews`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        message,
      }),
    });

    setMessage("");
    loadReviews();
  };

  /* =========================
     INIT LOAD
  ========================== */
  useEffect(() => {
    if (bikeId) {
      loadBike();
      loadReviews();
    }
  }, [bikeId]);

  /* =========================
     LOGIN BUTTON
  ========================== */
  const Loginbutton = () =>
    state ? (
      <NavLink className="btn" to="/signout">Logout</NavLink>
    ) : (
      <NavLink className="btn" to="/signin">Login</NavLink>
    );

  if (!bike) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <NavLink className="logo" to="/">
          <span>Bike</span>Book
        </NavLink>

        <nav className="navbar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/rentbike">Rent Bikes</NavLink>
        </nav>

        <div id="login-btn">{Loginbutton()}</div>
      </header>

      {/* BIKE DETAILS */}
      <div className="reviewsdiv">
        <img
          src={`${process.env.REACT_APP_API_URL}${bike.filePath}`}
          alt={bike.model}
          style={{ width: "60%", maxHeight: "400px", objectFit: "contain" }}
        />

        <h3>{bike.brand} {bike.model}</h3>
        <p>Year: {bike.year}</p>
        <p>Color: {bike.color}</p>
        <p>Seats: {bike.seats}</p>
        <p>Rent / Hour: ₹{bike.rent}</p>
      </div>

      {/* REVIEWS */}
      <section className="contact">
        <h1 className="heading">
          <span>Reviews</span>
        </h1>

        {reviews.length === 0 && (
          <p style={{ textAlign: "center" }}>No reviews yet</p>
        )}

        {reviews.map((rev, i) => (
          <div className="reviewsli" key={i}>
            <strong>{rev.name}</strong>
            <p>{rev.comments}</p>
          </div>
        ))}

        {/* WRITE REVIEW */}
        {state && user && (
          <div className="row">
            <form onSubmit={submitReview}>
              <h3>Write Your Review</h3>

              <input
                type="text"
                value={user.name}
                disabled
                className="box"
              />

              <input
                type="email"
                value={user.email}
                disabled
                className="box"
              />

              <textarea
                className="box"
                placeholder="Write your review..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
              />

              <input type="submit" className="btn" value="Submit Review" />
            </form>
          </div>
        )}

        {!state && (
          <p style={{ textAlign: "center" }}>
            <NavLink to="/signin">Login</NavLink> to write a review
          </p>
        )}
      </section>
    </>
  );
};

export default Rentbikereviews;
