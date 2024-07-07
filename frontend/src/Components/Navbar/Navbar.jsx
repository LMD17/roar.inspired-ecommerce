import React, { useContext, useRef } from 'react'
import { useState } from 'react';
import './Navbar.css'
import logo from'../Assets/roar_inspired_logo_whitebg_crop.png'
import cart_icon from '../Assets/icons/shopping-cart.svg'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/icons/arrow-down-circle.svg'

const Navbar = () => {

  const [menu,setMenu] = useState("shop");
  const {getTotalCartItems} = useContext(ShopContext);
  const menuRef = useRef();

  // method to change nav menu when screen width is small
  const dropdown_toggle = (e) =>{
    menuRef.current.classList.toggle('nav-menu-visible')
    e.target.classList.toggle('open')
  }

  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} alt="ROAR Logo" style={{ width: '100', height: '100' }}/>
            {/* <p>ROAR Inspired</p> */}
        </div>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="dropdown icon" />
        <ul ref={menuRef} className='nav-menu'>
            <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("general")}}><Link style={{textDecoration: 'none'}} to='/general'>General</Link>{menu==="general"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("men")}}><Link style={{textDecoration: 'none'}} to='/men'>Men</Link>{menu==="men"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration: 'none'}} to='/women'>Women</Link>{menu==="women"?<hr/>:<></>}</li>
        </ul>
        <div className='nav-login-cart'>
          {/* if the auth-token is available then display the logout button (which removes the auth-token and redirects user to home page). else display login button */}
          {localStorage.getItem('auth-token')
          ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
          :<Link to='/login'><button>Login</button></Link>}
          <Link to='/cart'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar
