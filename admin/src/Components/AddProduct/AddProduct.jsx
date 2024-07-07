import { useState } from 'react'
import './AddProduct.css'
import upload_icon from '../../assets/icons/upload-cloud.svg'


const AddProduct = () => {
    const url = "https://roar-inspired-ecommerce-backend.onrender.com"

    const [image,setImage] = useState(false);
    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"general",
        new_price:"",
        old_price:"",
    })
    const imageHandler = (e) =>{
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) =>{
        setProductDetails({...productDetails, [e.target.name]:e.target.value})
    }


    // add product to database
    const Add_Product = async ()=>{
        console.log(productDetails)
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        await fetch(url + '/upload', {
            method:'POST',
            headers:{
                Accept:'application/json'
            },
            body:formData,
        }).then((response) => response.json()).then((data)=>{responseData=data})

        // if success then we have successfully uploaded image and we can get url
        if(responseData.success)
            {
                product.image = responseData.image_url;
                console.log(product);
                await fetch(url + '/addproduct', {
                  method: 'POST',
                  headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                  },
                  body: JSON.stringify(product),
                }).then((response)=>response.json()).then((data)=>{
                  data.success?alert("Product Added"):alert("Failed to Add Product")
                })
            }
    }

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Type here...' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
            <p>Price</p>
            <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here...' />
        </div>
        <div className="addproduct-itemfield">
            <p>Offer Price</p>
            <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here...' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
            <option value="general">General</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Image</p>
        <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_icon} alt="upload icon" className='addproduct-icon' />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={()=>{Add_Product()}} className='addproduct-button'>ADD</button>
    </div>
  )
}

export default AddProduct
