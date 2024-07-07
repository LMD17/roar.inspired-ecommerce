import React, {createContext, useEffect, useState} from "react";


export const ShopContext = createContext(null);

// create default cart
const getDefaultCart = ()=>{
    let cart = {};
    for (let index = 0; index <= 200+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) =>{
    const url = "https://roar-inspired-ecommerce-backend.onrender.com"
    const[all_products, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    // load images from database
    useEffect(()=>{
        fetch(url + '/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        // if user is logged in (has an auth-token)
        if (localStorage.getItem('auth-token')) {
            // fetch user cart data
            fetch(url + '/getcart',{
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body:"",
            })
            .then((response)=>response.json())
            .then((data)=>setCartItems(data))   // set user cart items
        }
    },[])

    // add to cart
    const addToCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        // Send POST request to server (/addtocart endpoint) if user is logged in
        // Check for authentication token to verify user is logged in
        if(localStorage.getItem('auth-token')){
            fetch(url + '/addtocart',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())  // get response from server
            .then((data)=>console.log(data.message))    // log response from server on console
        }
    }

    // remove from cart
    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        // Send POST request to server (/removefromcart endpoint) if user is logged in
        // Check for authentication token to verify user is logged in
        if(localStorage.getItem('auth-token')){
            fetch(url + '/removefromcart',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())  // get response from server
            .then((data)=>console.log(data.message))    // log response from server on console
        }
    }

    // get total amount in cart
    const getTotalCartAmount = () => {
        let totalAmount = 0
        for(const item in cartItems)
            {   
                // check if there are items in the cart
                if(cartItems[item] > 0)
                    {
                        let itemInfo = all_products.find((product)=>product.id===Number(item))  // get item information
                        totalAmount += itemInfo.new_price * cartItems[item];    // calculate total amount
                    }
            }
            return totalAmount  // return total amount
    }

    // get total cart items
    const getTotalCartItems = () => {
        let totalItems = 0
        for(const item in cartItems)
            {
                if(cartItems[item] > 0)
                    {
                        totalItems += cartItems[item]
                    }
            }
            return totalItems
    }
    
    const contextValue = {getTotalCartItems, getTotalCartAmount, all_products, cartItems, addToCart, removeFromCart}

    return(
            <ShopContext.Provider value={contextValue}>
                {props.children}
            </ShopContext.Provider>
        )
}

export default ShopContextProvider;