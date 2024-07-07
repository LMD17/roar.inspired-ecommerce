import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>ROAR is an clothing retailer with the aim of spreading the Gospel through what we wear!</p>
        <p>SHaring the Gospel in style is such a great way to share our faith and start cool conversations!</p>
      </div>
    </div>
  )
}

export default DescriptionBox
