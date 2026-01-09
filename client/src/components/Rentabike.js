import React, { useState, useEffect, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../App";

const Rentabike = () => {
  const { state } = useContext(UserContext);
  const history = useHistory();

  const [rentBikesData, setRentBikesData] = useState([]);
  const [rentHours, setRentHours] = useState("");
  const [searchText, setSearchText] = useState("");

  /* 🔐 Redirect if not logged in */
  useEffect(() => {
    if (!state) {
      alert("Please signin to see all available bikes for rent!");
      history.push("/signin");
    }
  }, [state, history]);

  /* 🚲 Fetch all bikes */
  const allRentBikes = async () => {
    try {
      const data = await apiFetch("/getRentBikeData", {
        method: "GET",
      });
      setRentBikesData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    allRentBikes();
  }, []);

  /* 🔍 Search bikes */
  const searchTextBtn = async () => {
    try {
      await apiFetch("/searchRentBike", {
        method: "POST",
        body: JSON.stringify({ searchText }),
      });

      const data = await apiFetch("/rentbikesearchCategory", {
        method: "GET",
      });

      setRentBikesData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  /* 🛒 Add to cart */
  const proceedToCart = async (e, bikeId) => {
    e.preventDefault();

    if (!bikeId){
        alert("Bike ID missing!");
        return;
    }
    

    try {
      await apiFetch("/addrentcartocart", {
        method: "POST",
        body: JSON.stringify({
          itemId:bikeId,
          rentHours,
        }),
      });

      alert("Item added. Please go to cart to complete purchase.");
      setRentHours("");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  /* 🔑 Login / Logout button */
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
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>

          <NavLink className="nav-link" to="/rentbikecart">
            Go To Cart
          </NavLink>

          <input
            type="text"
            placeholder="Search Bike"
            style={{ width: "30%", height: "8%" }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="btn"
          />

          <button onClick={searchTextBtn} className="btn">
            <i className="fa fa-search"></i>
          </button>
        </nav>

        <div id="login-btn">
          <Loginbutton />
        </div>
      </header>

      {/* BIKES LIST */}
      <div className="rentbikebiked">
        {rentBikesData.map((bike) => (
          <div className="bikedivRentbike" key={bike._id}>
            <img
              src={`${process.env.REACT_APP_API_URL}${bike.filePath}`}
              alt={bike.model}
              style={{ width: "80%", height: "70%" }}
            />

            <h4>{bike.brand}</h4>
            <p>{bike.model}</p>

            <p>Year: {bike.year}</p>
            <p>Color: {bike.color}</p>
            <p>Seats: {bike.seats}</p>
            <p>Rent Per Hour: {bike.rent}</p>
            <p style={{ color: "red" }}>
              Availability: {bike.availability} hours
            </p>

            <button className="bikedbtn">
              <NavLink
                className="nav-link"
                to={`/rentbikereviews/${bike._id}`}
              >
                Bike Reviews
              </NavLink>

            </button>

            <form onSubmit= {(e) => proceedToCart(e, bike._id)}>
              <input
                type="number"
                className="bikedbtn"
                placeholder="Enter rent hours"
                value={rentHours}
                onChange={(e) => setRentHours(e.target.value)}
                required
              />

              <input
                type="submit"
                className="bikedbtn"
                value="Proceed"
                id={bike._id}
              />
            </form>
          </div>
        ))}
      </div>
    </>
  );
};

export default Rentabike;
