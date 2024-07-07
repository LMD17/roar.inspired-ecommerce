import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/icons/trash-2.svg'
import { useNavigate } from 'react-router-dom'

const CartItems = () => {
  const {getTotalCartAmount, all_products, cartItems, removeFromCart} = useContext(ShopContext)

  const navigate = useNavigate(); // navigate to enable page navigation

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_products.map((e)=>{
        if(cartItems[e.id] > 0)
            {
                return <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className='cartitems-product-icon' />
                                <p>{e.name}</p>
                                <p>R{e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>R{e.new_price*cartItems[e.id]}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="remove icon" />
                            </div>
                            <hr />
                        </div>
            }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>R{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Delivery Fee</p>
              <p>R{150}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>R{getTotalCartAmount()+150}</h3>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="caritems-promocode">
          <p>If you have a promo code, Please enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='promo code' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems
