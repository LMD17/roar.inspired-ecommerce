import React from 'react'
import './Arrivals.css'
import arrow_icon from '../Assets/icons/arrow-right.svg'
import logo_img from '../Assets/1.png'
import logo from'../Assets/lion_logo_black.png'

const Arrivals = () => {
  return (
    <div className='arrivals'>
      <div className="arrivals-left">
        <h2>NEW ARRIVALS</h2>
        <div>
            <p>new</p>
            <p>arrivals</p>
            <p>for everyone</p>
        </div>
        <div className="arrivals-latest-button">
            <img src={logo} alt="arrow icon" />
            <p>Latest Collection</p>
            <img id='arrow_icon' src={arrow_icon} alt="arrow icon" />
        </div>
      </div>
      <div className="arrivals-right">
        <img src={logo_img} alt="arrivals" />
      </div>
    </div>
  )
}

export default Arrivals
