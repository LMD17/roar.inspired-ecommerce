import React, { useContext, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import './CSS/PlaceOrder.css'

const PlaceOrder = () => {

    const {getTotalCartAmount, all_products, cartItems} = useContext(ShopContext)

    // create state variable
    const [data, setData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        street:"",
        city:"",
        province:"",
        zipcode:"",
        country:"",
        phone:"",
    })

    // on change handler
    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const placeOrder = async (event) => {
        event.preventDefault(); //prevent reload when form is submitted
        let orderItems = [];
        // add all item data with the quantity into orderItems array
        all_products.map((item)=>{
            if (cartItems[item.id]>0) {
                let itemInfo = item;
                itemInfo["quantity"]=cartItems[item.id];
                orderItems.push(itemInfo);
            }
            return null
        })
        // generate order data
        let orderData = {
            address:data,
            items:orderItems,
            amount:getTotalCartAmount()+150
        }
        // Log order data for debugging
        console.log('Order Data:', orderData);
        
        // send order data to api and get response
        let responseData
        await fetch('http://localhost:4000/placeorder',{
            method: 'POST',
            headers:{
              Accept:'application/json',
              'auth-token':`${localStorage.getItem('auth-token')}`,
              'Content-Type':'application/json',
            },
            body: JSON.stringify(orderData),
        }).then((response)=> response.json()).then((data)=>responseData=data)

        console.log(responseData)
        // if success is true
        if(responseData.success){
        const {session_url} = responseData;    // get session url
        console.log(session_url)
        window.location.replace(session_url); // redirect user to session page
        }
        else  // sign up failed
        {
        // alert(responseData.errors)  // alert with errors
        alert(responseData ? responseData.message : 'An error occurred.');  // alert with errors
        }
    }

  return (
    <form onSubmit={placeOrder} className='placeorder'>
        <div className='placeorder-left'>
            <h1>Delivery Details</h1>
            <div className="multi-fields">
                <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
            </div>
            <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
            <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
            <div className="multi-fields">
                <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                <input required name='province' onChange={onChangeHandler} value={data.province} type="text" placeholder='Province' />
            </div>
            <div className="multi-fields">
                <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
                <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
            </div>
            <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
        </div>
        <div className="placeorder-right">
            <div className="cart-items-total">
                <h1>Cart Totals</h1>
                <div>
                    <div className="cart-items-total-item">
                        <p>Subtotal</p>
                        <p>R{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cart-items-total-item">
                        <p>Delivery Fee</p>
                        <p>R{150}</p>
                    </div>
                    <hr />
                    <div className="cart-items-total-item">
                        <h3>Total</h3>
                        <h3>R{getTotalCartAmount()+150}</h3>
                    </div>
                </div>
                <button type='submit'>PROCEED TO PAYMENT</button>
            </div>
        </div>
    </form>
  )
}

export default PlaceOrder
