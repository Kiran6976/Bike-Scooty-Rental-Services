import React, {useState, useEffect, useContext} from 'react'
import {NavLink} from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

import { AdminContext } from "../../App"

const Getrentbikes = () => {

  const {adminState, dispatchadmin} = useContext(AdminContext)

  const [getBikes, setGetBikes] = useState([]);

  const getallrenttbikes = async () =>{
    try {
        const res = await apiFetch ('/getAvailableRentBikes', {
            method: 'GET',
        });

        const data = await res.json();
        setGetBikes(data);

    }
    catch (error) {
        console.log(error)
    }
}

useEffect(() => {
    getallrenttbikes();
}, [])
const deleteBike = async (bikeId) => {
  try {
    const res = await apiFetch("/deleteRentBikeFromDashboard", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bikeIdFromDashBoard: bikeId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      // update UI instantly
      setGetBikes((prev) =>
        prev.filter((bike) => bike._id !== bikeId)
      );
    }
  } catch (error) {
    console.log(error);
  }
};




  const Loginbutton= () =>{
        
    if(adminState){
        return <div> 
            <button className="logoutbtnDash"><NavLink className="nav-link" to="/adminsignout">logout</NavLink></button>      
        </div>
    }
    else{
        return <div>  
                <button className="logoutbtnDash"><NavLink className="nav-link" to="/signin">login</NavLink></button>
                
            </div>
    }
  }


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
            <i className='bx bx-grid-alt' ></i>
            <span className="allLinks_name">Dashboard</span>
            </NavLink>
        </li>
        <li>
            <NavLink className="dashlinks" to="/addbikes">
            <i class="fa-sharp fa-solid fa-square-plus"></i>
            <span className="allLinks_name">Add Bikes</span>
            </NavLink>
        </li>
        <li>
            <NavLink className="dashlinks" to="/getrentbikesforadmin">
            <i class="fa-sharp fa-solid fa-motorcycle"></i>
            <span className="allLinks_name">Available Rent Bikes</span>
            </NavLink>
        </li>
        <li>
            <NavLink className="dashlinks" to="/rentbikesreports">
            <i class="fa-solid fa-sack-dollar"></i>
            <span className="allLinks_name">Rent Bikes Income</span>
            </NavLink>
        </li>
        <li>
          <NavLink className="dashlinks" to="/availableusers">
          <i class="fa-solid fa-users"></i>
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
      
    <div className = "salecartableDiv">

            <h1 className="heading"><span>Available Rent Bikes</span></h1>

            <table className = "salecartable">
                  <thead>
                    <tr>
                      <th >BRAND </th>
                      <th >MODEL </th>
                      <th >RENT </th>
                      <th >PRICE </th>
                      <th >AVAILABILITY </th>
                      <th >DELETE </th>
                    </tr>
                    </thead>

        {getBikes.map((getBikes) => 
            <tbody   key={getBikes._id} >
                <tr>
                    <td >{getBikes.brand}</td>
                    <td >{getBikes.model}</td>
                    <td >{getBikes.rent}</td>
                    <td >{getBikes.price} Rupees</td>
                    <td >{getBikes.availability} hours</td>
                    <td ><button className= "btn delete-btn" onClick={() => deleteBike(getBikes._id)}><i className="fa fa-trash"></i></button></td>
                </tr> 
            </tbody>
         
        )}
      </table>
    </div>
    </section>
        </>
    )
}

export default Getrentbikes
