import './Sidebar.css'
import { Link } from 'react-router-dom'
import add_product_icon from '../../assets/icons/plus-circle.svg'
import list_product_icon from '../../assets/icons/list.svg'
import list_order_icon from '../../assets/icons/list.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/addproduct'} style={{textDecoration:"none"}} >
        <div className="sidebar-item">
            <img src={add_product_icon} alt="add product icon" />
            <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/listproduct'} style={{textDecoration:"none"}} >
        <div className="sidebar-item">
            <img src={list_product_icon} alt="list product icon" />
            <p>Product List</p>
        </div>
      </Link>
      <Link to={'/listorder'} style={{textDecoration:"none"}} >
        <div className="sidebar-item">
            <img src={list_order_icon} alt="list order icon" />
            <p>Order List</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
