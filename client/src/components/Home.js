
import React, {useState, useEffect, useContext} from 'react'
import { NavLink } from "react-router-dom";
import { UserContext } from "../App"

const Home = () => {
    const [userData, setUserData] = useState({name:"", email:"", phone:"", message:""});
    const [userInitial, setUserInitial] = useState("U");


    
    const {state, dispatch} = useContext(UserContext)

    

    const userContact = async () =>{
        try {
            const res = await fetch ('/getdata', {
                method: 'GET',
                headers:{
                    "Content-Type" : "application/json"
                },
            });

            const data = await res.json();
            
            setUserData({...userData, name:data.name, email:data.email, phone:data.phone});
            setUserInitial(data.name ? data.name.charAt(0).toUpperCase() : "U");


            if(!res.status === 200){
                const error = new Error(res.error);
                throw error;
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
       userContact();
    }, [])

    const handleInputs = (e) =>{
        const name = e.target.name;
        const value = e.target.value;

        setUserData({...userData, [name]:value });
    }

    const sendMessage = async (e) =>{
        e.preventDefault();

        const {name, email, phone, message}= userData;

        const res = await fetch('/contact',{
            method:'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                name, email, phone, message
            })
        });

        const data = await res.json();

        if(!data){
            console.log("message not sent");
        }
        else{
            alert("Message send")
            setUserData({...userData, message:""});
        }
    }

    
    
    const Loginbutton = () => {
  const [open, setOpen] = React.useState(false);

  if (state) {
    return (
      <div
        className="user-avatar"
        onClick={() => setOpen(!open)}
      >
        {userInitial}


        <div className={`avatar-menu ${open ? "active" : ""}`}>
          <NavLink to="/profile">My Profile</NavLink>
          <NavLink to="/signout">Logout</NavLink>
        </div>
      </div>
    );
  } else {
    return (
      <button>
        <NavLink className="btn" to="/signin">
          Login
        </NavLink>
      </button>
    );
  }
};



    return (
        

        <>

        <header className="header">

            <div id="menu-btn" className="fas fa-bars"></div>

            <NavLink className="logo" to="/"> Bike<span>Book</span></NavLink>
        
            

            <nav className="navbar">
                <NavLink  to="/">Home</NavLink>
                <NavLink  to="/rentbike">Rent Bikes</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <a href="#services">Testimonial</a>
                <a href="#contact">Contact</a>
            </nav>
            <div id="login-btn">
                    <Loginbutton />
            </div>

        </header> 


        

<section className="home" id="home">

<h3 data-speed="-2" className="home-parallax fw-bolder">Rent a Bike</h3>

<img data-speed="5" className="home-parallax" src="/image/home.png" alt=""/>

<NavLink className="btn" to="/exploreRentBikes">Bike Showcase</NavLink>

</section>

<section className="icons-container">

<div className="icons">
    <i className="fas fa-home"></i>
    <div className="content">
        <h3>150+</h3>
        <p>branches</p>
    </div>
</div>

<div className="icons">
  <i class="fa-sharp fa-solid fa-person-biking"></i>
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
<i class="fa-sharp fa-solid fa-motorcycle"></i>
    <div className="content">
        <h3>1500+</h3>
        <p>Available Bikes</p>
    </div>
</div>

</section>

<section className="services" id="services">

<h1 className="heading"> Our Customers <span>Thoughts</span> </h1>

<div className="box-container">

    <div className="box">
        <div className="rev-img">
            <img src="image\Akash.png" alt="Akash" />
        </div>
        <h3>Akash Kapali</h3>
        <p>My parents has installed a camera in my bike so that i can't pick any girl in my bike. But from BikeBook i rented a bike a picked my girl & went for a ride. Thanks guys for your service</p>
    </div>

    <div className="box">
    <div className="rev-img">
            <img src="/image/Parthiv.png" alt="Parthiv" />
        </div>
        <h3>Parthib Chakraborty</h3>
        <p>It's Good</p>
    </div>


    <div className="box">
    <div className="rev-img">
            <img src="/image/Puja.png" alt="Puja" />
        </div>
        <h3>Puja Das</h3>
        <p>Thanks for the services. I loved the bikes </p>
    </div>

</div>

</section>





<section className="contact" id="contact">

<h1 className="heading"><span>contact</span> us</h1>

<div className="row">

    <form method="POST">
        <h3>get in touch</h3>
        <input type="text" name="name" value={userData.name} onChange={handleInputs} placeholder="your name" className="box"/>
        <input type="email" name="email" value={userData.email} onChange={handleInputs} placeholder="your email" className="box"/>
        <input type="tel" name="phone" value={userData.phone} onChange={handleInputs} placeholder="your phone" className="box"/>
        <textarea placeholder="your message" name="message" value={userData.message} onChange={handleInputs} className="box" cols="30" rows="10"></textarea>
        <input type="submit" value="send message" onClick={sendMessage} className="btn"/>
    </form>

</div>

</section>

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



export default Home
