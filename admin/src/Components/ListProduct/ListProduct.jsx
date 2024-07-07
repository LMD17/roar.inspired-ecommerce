import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import remove_icon from '../../assets/icons/trash-2.svg'

const ListProduct = () => {
  const url = "https://roar-inspired-ecommerce-backend.onrender.com"

  const [allproducts, setAllProducts] = useState([]);

  // get all products function
  const fetchInfo = async () =>{
    await fetch(url + '/allproducts')
    .then((response)=>response.json())
    .then((data)=>{setAllProducts(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[])

  // remove product function
  const removeProduct = async (id)=>{
    await fetch(url + '/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
  }

  return (
    <div className='listproduct'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
          return <React.Fragment key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="product image" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>R{product.old_price}</p>
              <p>R{product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{removeProduct(product.id)}} src={remove_icon} alt="remove icon" className="listproduct-remove-icon" />
          </div>
          <hr />
          </React.Fragment>
        })}
      </div>
    </div>
  )
}

export default ListProduct
