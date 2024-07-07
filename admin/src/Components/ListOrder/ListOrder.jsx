import React, { useEffect, useState } from 'react'
import './ListOrder.css'
import remove_icon from '../../assets/icons/trash-2.svg'

const ListOrder = () => {
  const url = "https://roar-inspired-ecommerce-backend.onrender.com"

  const [allorders, setAllOrders] = useState([]);

  // get all products function
  const fetchInfo = async () =>{
    await fetch(url+ '/allorders')
    .then((response)=>response.json())
    .then((data)=>{setAllOrders(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[])

  // remove product function
  const removeOrder = async (id)=>{
    await fetch(url+ '/removeorder',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
  }

  // status handler (update) function
  const statusHandler = async (event, orderId)=>{
    let responseData
    await fetch(url+ '/updateorderstatus',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        id:orderId,
        status:event.target.value
      })
    }).then((response) => response.json()).then((data)=>{responseData=data})

    // if success then we updated order status
    if(responseData.success)
      {
        console.log(responseData)
        await fetchInfo();  // refresh orders
      }
  }


  return (
    <div className='listorder'>
      <h1>All Orders List</h1>
      <div className="order-list">
        {allorders.map((order,index)=>{
          return <React.Fragment key={index}>
            <div key={index} className="order-item">
              <p className='order-item-product'>
              {order.items.map((item, idx) => (
                  idx === order.items.length - 1 ? `${item.name} x ${item.quantity}` : `${item.name} x ${item.quantity}, `
                ))}
              </p>
              <div>
                <p className='order-item-name'>{order.address.firstName+" "+order.address.lastName}</p>
                <div className="order-item-address">
                  <p>{order.address.street+","}</p>
                  <p>{order.address.city+", "+order.address.province+", "+order.address.country+", "+order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
                <p>Items: {order.items.length}</p>
                <p>R{order.amount}</p>
                <select onChange={(event)=>statusHandler(event, order._id)} value={order.status}>
                  <option value="Order Processing">Order Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <img onClick={()=>{removeOrder(order._id)}} src={remove_icon} alt="remove icon" className="listproduct-remove-icon" />
            </div>
          </React.Fragment>
        })}
      </div>
    </div>
  )
}

export default ListOrder
