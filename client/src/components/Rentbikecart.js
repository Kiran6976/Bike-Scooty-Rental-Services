import React, {useState, useEffect, useContext} from 'react'
import { NavLink, useHistory } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

import { UserContext } from "../App"

const Rentbikecart = () => {

    const {state, dispatch} = useContext(UserContext)

    const [cartUser, setCartUser] = useState([]);
    const [items, setItems] = useState([]);
    let itemsPrice, idOfRentedBike, reqHours;

    const getCartData = async () =>{
        try {
            const res = await apiFetch ('/getRentCartData', {
                method: 'GET',
            });

            const data = await res.json();
            setCartUser(data.userById)
            setItems(data.cartItems)
          

            if(!res.status === 200){
                const error = new Error(res.error);
                throw error;
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCartData();
    }, [])
    
    items.map(items =>{
        itemsPrice = items.totalbill;
        idOfRentedBike = items.rentbikeid;
        reqHours = items.requiredhours;
    })

    const handlePayMethod = (itemsPrice, token) =>{
            return apiFetch("/stripeRentPay", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    token: token.id, 
                    amount: itemsPrice,
                    idRentedBike: idOfRentedBike,
                    hoursRequired: reqHours
                })
            })
            
    }

    const tokenHandler = (token) =>{
        handlePayMethod(itemsPrice, token);
        updateDataBase();
    }


    const updateDataBase = () =>{
        return apiFetch("/updateRentDataBase", {
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                items
            })
        })
    }


   
    
    const Loginbutton= () =>{
        
        if(state){
            return <div> 
                <button ><NavLink className="btn" to="/signout">logout</NavLink></button>      
            </div>
        }
        else{
            return <div>  
                    <button ><NavLink className="btn" to="/signin">login</NavLink></button>
                    
                </div>
        }
    }

  let rentCartItemId;

const deleteRentItem = (e) => {
  rentCartItemId = e.target.id;

  return apiFetch("/deleteRentCartItem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rentCartItemId
    })
  })
  .then(() => {
    // update UI after delete
    setItems(items.filter(item => item._id !== rentCartItemId));
  })
  .catch(err => console.log(err));
};

const loadRazorpay = async () => {
  const res = await apiFetch("/create-razorpay-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: itemsPrice }),
  });

  const order = await res.json();

  const options = {
    key: "rzp_test_xxxxx", // frontend key only
    amount: order.amount,
    currency: "INR",
    name: "BikeBook",
    description: "Bike Rental Payment",
    order_id: order.id,

    handler: async function (response) {
      const verifyRes = await apiFetch("/verify-razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        alert("Payment Successful!");
        updateDataBase(); // clear cart / mark paid
      } else {
        alert("Payment Verification Failed");
      }
    },

    theme: {
      color: "#ff6a00",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


    return (
        <>
             <header className="header">
                <div id="menu-btn" className="fas fa-bars"></div>
                <NavLink className="logo" to="/"> <span>Bike</span>Book </NavLink>

                <nav className="navbar">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/rentbike">Rent Bikes</NavLink>
                </nav>

                <div id="login-btn">
                    <Loginbutton />
                </div>
            </header>

            <div className='salecartMaindiv'>
            <div style={{
                marginTop: "150px",  
                }}>
                {items.map((items) => 
                    <div className = "salecartLidiv"  key={items._id}>
                            <ul>
                                <li style={{wordSpacing: "10px"}}>Brand: {items.brand} --- Model: {items.model} --- Hours: {items.requiredhours} --- RentPerHour: {items.rentperhour}Rupees --- TotalBill: {items.totalbill}Rupees   <button id={items._id} onClick={deleteRentItem} className="btn"><i className="fa fa-trash"></i></button></li>
                            </ul> 
                        </div>
                     
            )}
                        <div style={{padding: "30px",  textAlign:"center"}}>
                            <h2>Pay Through Credit / Debit Biked</h2><br/>
                            
                            <button className="btn" onClick={loadRazorpay}>Pay Now</button>
                        </div>               
            </div>
            </div>
        </>
    )
}

export default Rentbikecart
