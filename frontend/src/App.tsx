import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewArrivals from './components/NewArrivals';
import Categories from './components/Categories';
import Footer from './components/Footer';
import LatestArrivals from './components/LatestArrivals';
import FeaturedCategories from './components/FeaturedCategories';
// import VirtualTryOn from './pages/VirtualTryOn';
import Cart from './pages/Cart';
import CasualCollectiont from './pages/CasualCollection';
import NewArrivalsCollection from './pages/NewArrivalsCollection';
import MenCollection from './pages/MenCollection';
import WomenCollection from './pages/WomenCollection';
import OnSaleCollection from './pages/OnSaleCollection';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import VirtualTryOnNew from './pages/VirtualTryOnNew';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';

// Create a Home component to include your main page sections
function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <LatestArrivals />
      <Categories />
      <FeaturedCategories />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/try-on" element={<VirtualTryOn />} /> */}
            <Route path="/try-on" element={<VirtualTryOnNew />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/casual" element={<CasualCollectiont />} />
            <Route path="/men" element={<MenCollection />} />
            <Route path="/shop/men" element={<MenCollection />} />
            <Route path="/women" element={<WomenCollection />} />
            <Route path="/sale" element={<OnSaleCollection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/new-arrivals" element={<NewArrivalsCollection />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

