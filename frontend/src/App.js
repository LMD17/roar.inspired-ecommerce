import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import general_banner from './Components/Assets/GET_WILD_Banner_sml.png';
import men_banner from './Components/Assets/GET_WILD_Banner_sml.png';
import women_banner from './Components/Assets/GET_WILD_Banner_sml.png';
import PlaceOrder from './Pages/PlaceOrder';

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* mount navbar */}
        <Navbar />
        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/general" element={<ShopCategory banner={general_banner} category="general" />} />
          <Route path="/men" element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path="/women" element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
        {/* Mount Footer */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
