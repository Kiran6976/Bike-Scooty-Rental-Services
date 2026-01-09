import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import apiFetch from "../utils/apiFetch";

const Home = () => {
  const { state } = useContext(UserContext);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [userInitial, setUserInitial] = useState("U");

  // 🔹 Fetch logged-in user data
  const userContact = async () => {
    try {
      const data = await apiFetch("/getdata", {
        method: "GET",
      });

      setUserData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        phone: data.phone,
      }));

      setUserInitial(data.name ? data.name.charAt(0).toUpperCase() : "U");
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    userContact();
  }, []);

  // 🔹 Handle contact form inputs
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // 🔹 Send contact message
  const sendMessage = async (e) => {
    e.preventDefault();

    const { name, email, phone, message } = userData;

    try {
      const data = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, message }),
      });

      alert("Message sent successfully");
      setUserData({ ...userData, message: "" });
      console.log(data);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  // 🔹 Login / Avatar button
  const Loginbutton = () => {
    const [open, setOpen] = useState(false);

    if (state) {
      return (
        <div className="user-avatar" onClick={() => setOpen(!open)}>
          {userInitial}

          <div className={`avatar-menu ${open ? "active" : ""}`}>
            <NavLink to="/profile">My Profile</NavLink>
            <NavLink to="/signout">Logout</NavLink>
          </div>
        </div>
      );
    }

    return (
      <button>
        <NavLink className="btn" to="/signin">
          Login
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
          Bike<span>Book</span>
        </NavLink>

        <nav className="navbar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/rentbike">Rent Bikes</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <a href="#services">Testimonial</a>
          <a href="#contact">Contact</a>
        </nav>

        <div id="login-btn">
          <Loginbutton />
        </div>
      </header>

      {/* HERO */}
      <section className="home" id="home">
        <h3 data-speed="-2" className="home-parallax fw-bolder">
          Rent a Bike
        </h3>

        <img
          data-speed="5"
          className="home-parallax"
          src="/image/home.png"
          alt=""
        />

        <NavLink className="btn" to="/exploreRentBikes">
          Bike Showcase
        </NavLink>
      </section>

      {/* ICONS */}
      <section className="icons-container">
        <div className="icons">
          <i className="fas fa-home"></i>
          <div className="content">
            <h3>150+</h3>
            <p>branches</p>
          </div>
        </div>

        <div className="icons">
          <i className="fa-solid fa-person-biking"></i>
          <div className="content">
            <h3>4770+</h3>
            <p>Bikes Rented</p>
          </div>
        </div>

        <div className="icons">
          <i className="fas fa-users"></i>
          <div className="content">
            <h3>320+</h3>
            <p>happy clients</p>
          </div>
        </div>

        <div className="icons">
          <i className="fa-solid fa-motorcycle"></i>
          <div className="content">
            <h3>1500+</h3>
            <p>Available Bikes</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="services" id="services">
        <h1 className="heading">
          Our Customers <span>Thoughts</span>
        </h1>

        <div className="box-container">
          <div className="box">
            <div className="rev-img">
              <img src="/image/Akash.png" alt="Akash" />
            </div>
            <h3>Akash Kapali</h3>
            <p>
              BikeBook helped me rent a bike and enjoy my ride. Great service!
            </p>
          </div>

          <div className="box">
            <div className="rev-img">
              <img src="/image/Parthiv.png" alt="Parthiv" />
            </div>
            <h3>Parthib Chakraborty</h3>
            <p>It's good.</p>
          </div>

          <div className="box">
            <div className="rev-img">
              <img src="/image/Puja.png" alt="Puja" />
            </div>
            <h3>Puja Das</h3>
            <p>Thanks for the services. I loved the bikes.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <h1 className="heading">
          <span>contact</span> us
        </h1>

        <div className="row">
          {/* ✅ use onSubmit */}
          <form onSubmit={sendMessage}>
            <h3>get in touch</h3>

            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputs}
              placeholder="your name"
              className="box"
              required
            />

            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputs}
              placeholder="your email"
              className="box"
              required
            />

            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleInputs}
              placeholder="your phone"
              className="box"
              required
            />

            <textarea
              name="message"
              value={userData.message}
              onChange={handleInputs}
              placeholder="your message"
              className="box"
              cols="30"
              rows="10"
              required
            ></textarea>

            <input type="submit" value="send message" className="btn" />
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <section className="footer" id="footer">

<div className="box-container">

    <div className="box">
        <h3>our branches</h3>
        <a href="#"> <i className="fas fa-map-marker-alt"></i> Agartala </a>
        <a href="#"> <i className="fas fa-map-marker-alt"></i> Assam </a>
        <a href="#"> <i className="fas fa-map-marker-alt"></i> Kolkata </a>
        <a href="#"> <i className="fas fa-map-marker-alt"></i> Patna </a>
        <a href="#"> <i className="fas fa-map-marker-alt"></i> Delhi </a>
    </div>

    <div className="box">
        <h3>quick links</h3>
        <a href="#"> <i className="fas fa-arrow-right"></i> home </a>
        <a href="#"> <i className="fas fa-arrow-right"></i> vehicles </a>
        <a href="#"> <i className="fas fa-arrow-right"></i> services </a>
        <a href="#"> <i className="fas fa-arrow-right"></i> featured </a>
        <a href="#"> <i className="fas fa-arrow-right"></i> reviews </a>
        <a href="#"> <i className="fas fa-arrow-right"></i> contact </a>
    </div>

    <div className="box">
        <h3>contact info</h3>
        <a href="#"> <i className="fas fa-phone"></i> +123-456-7890 </a>
        <a href="#"> <i className="fas fa-phone"></i> +111-222-3333 </a>
        <a href="#"> <i className="fas fa-envelope"></i> bikebook@gmail.com </a>
        <a href="#"> <i className="fas fa-map-marker-alt"></i> Ramnagar, Agartala, West Tripura </a>
    </div>

    <div className="box">
        <h3>contact info</h3>
        <a href="#"> <i className="fab fa-facebook-f"></i> facebook </a>
        <a href="#"> <i className="fab fa-twitter"></i> twitter </a>
        <a href="#"> <i className="fab fa-instagram"></i> instagram </a>
        <a href="#"> <i className="fab fa-linkedin"></i> linkedin </a>
        <a href="#"> <i className="fab fa-pinterest"></i> pinterest </a>
    </div>

</div>

<div className="credit"> Made with ❤️ | All rights reserved </div>

</section>





        </>
    )
    
}



export default Home;
