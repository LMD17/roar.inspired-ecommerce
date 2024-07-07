import React from 'react'
import './Navbar.css'
import logo from'../../assets/roar_inspired_logo_whitebg_crop.png'
import navprofile from '../../assets/icons/user.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="roar logo" className="nav-logo" />
      <img src={navprofile} alt="profile icon" className='nav-profile' />
    </div>
  )
}

export default Navbar
