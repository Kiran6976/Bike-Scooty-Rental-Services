import React, { useState, useEffect } from 'react'
import { NavLink, useHistory } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

const Addbikes = () => {

  const history = useHistory();

  /* 🔐 Verify Admin */
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        await apiFetch('/getadmindata', {
          method: "GET",
          credentials: "include",
        });
      } catch (error) {
        history.replace("/adminsignin");
      }
    };
    verifyAdmin();
  }, [history]);

  /* =========================
      RENT BIKE STATE
  ========================= */

  const [rentFile, setRentFile] = useState(null);
  const [rentbike, setRentBike] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    seats: "",
    price: "",
    rent: ""
  });

  const handleRentInputs = (e) => {
    const { name, value } = e.target;
    setRentBike({ ...rentbike, [name]: value });
  };

  const handleRentFile = (e) => {
    setRentFile(e.target.files[0]);
  };

  const postRentData = async (e) => {
    e.preventDefault();

    try {
      const rentData = new FormData();

      Object.entries(rentbike).forEach(([key, value]) => {
        rentData.append(key, value);
      });

      if (rentFile) {
        rentData.append("myrentfile", rentFile);
      }

      await apiFetch("/addrentbikes", {
        method: "POST",
        body: rentData
      });

      alert("Rent bike added successfully");

    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
      LOGIN BUTTON (FIXED)
  ========================= */

  const Loginbutton = () => {
    return (
      <div>
        <button className="logoutbtnDash">
          <NavLink className="nav-link" to="/adminsignout">logout</NavLink>
        </button>
      </div>
    );
  };

  /* =========================
      JSX (UNCHANGED)
  ========================= */

  return (
    <>
      <div className="sidebar">
        <div className="logo-details">
          <i className=''></i>
          <span className='logo_name1'>Bike</span><span className="logo_name">Book</span>
        </div>

        <ul className="nav-links">
          <li>
            <NavLink className="dashlinks" to="/dashboard">
              <i className='bx bx-grid-alt'></i>
              <span className="allLinks_name">Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink className="dashlinks" to="/addbikes">
              <i className="fa-sharp fa-solid fa-square-plus"></i>
              <span className="allLinks_name">Add Bikes</span>
            </NavLink>
          </li>

          <li>
            <NavLink className="dashlinks" to="/getrentbikesforadmin">
              <i className="fa-sharp fa-solid fa-motorcycle"></i>
              <span className="allLinks_name">Available Rent Bikes</span>
            </NavLink>
          </li>

          <li>
            <NavLink className="dashlinks" to="/rentbikesreports">
              <i className="fa-solid fa-sack-dollar"></i>
              <span className="allLinks_name">Rent Bikes Income</span>
            </NavLink>
          </li>

          <li>
            <NavLink className="dashlinks" to="/availableusers">
              <i className="fa-solid fa-users"></i>
              <span className="allLinks_name">Available Users</span>
            </NavLink>
          </li>
        </ul>

        <div className="logoutbtnDashDiv">
          <Loginbutton/>
        </div>
      </div>

      <section className="home-section">
        <nav>
          <div className="sidebar-button">
            <span className="dashboard">Dashboard</span>
          </div>

          <div className="profile-details">
            <span className="admin_name">Admin</span>
          </div>
        </nav>

        <div className="home-content">
          <div className="sales-boxes">
            <div className="recent-sales box">
              <h1 className="heading"><span>Add Bikes For Rent</span></h1>

              <form className="addbikeform" onSubmit={postRentData}>
                <label>Brand:</label>
                <input name="brand" value={rentbike.brand} onChange={handleRentInputs} /><br/>

                <label>Model:</label>
                <input name="model" value={rentbike.model} onChange={handleRentInputs} /><br/>

                <label>Year:</label>
                <input name="year" value={rentbike.year} onChange={handleRentInputs} /><br/>

                <label>Color:</label>
                <input name="color" value={rentbike.color} onChange={handleRentInputs} /><br/>

                <label>Seats:</label>
                <input name="seats" value={rentbike.seats} onChange={handleRentInputs} /><br/>

                <label>Price:</label>
                <input name="price" value={rentbike.price} onChange={handleRentInputs} /><br/>

                <label>Rent:</label>
                <input name="rent" value={rentbike.rent} onChange={handleRentInputs} /><br/>

                <label>Picture:</label>
                <input type="file" onChange={handleRentFile} />

                <div className="button">
                  <input type="submit" value="Add Bike"/>
                </div>
              </form>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Addbikes;
