import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  const url = "https://roar-inspired-ecommerce-backend.onrender.com"

  const [state, setState] = useState("Login");

  // sotre form data
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  // change handler function to update fields
  const changeHandler = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }


  // login function
  const login = async ()=>{
    console.log("Login function executed", formData)
    let responseData
    await fetch(url + '/login',{
      method: 'POST',
      headers:{
        Accept:'application/form-data',
        'content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);  // auth token is save and user is logged in.
      window.location.replace("/"); // redirect user to home page
    }
    else  // sign up failed
    {
      alert(responseData.errors)  // alert with errors
    }
  }

  // signup function
  const signup = async ()=>{
    console.log("Signup function executed", formData)
    let responseData
    await fetch(url + '/signup',{
      method: 'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);  // auth token is save and user is logged in.
      window.location.replace("/"); // redirect user to home page
    }
    else  // sign up failed
    {
      alert(responseData.errors)  // alert with errors
    }
  }


  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign up"?<input name='username' type="text" placeholder='Your Name' value={formData.username} onChange={changeHandler}/>:<></>}
          <input name='email' type="email" placeholder='Email Address' value={formData.email} onChange={changeHandler}/>
          <input name='password' type="password" placeholder='Password' value={formData.password} onChange={changeHandler}/>
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign up"?<p className='loginsignup-login'>Already have an account? <span onClick={()=>setState("Login")}>Login here</span></p>
        : <p className='loginsignup-login'>Create an account? <span onClick={()=>setState("Sign up")}>Sign up here</span></p>}
        
        
        <div className="loginsignup-agree">
          <input required type="checkbox" />
          <p>By continuing, I agree to the terms  of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
