import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewArrivals from './components/NewArrivals';
import Categories from './components/Categories';
import Footer from './components/Footer';
import LatestArrivals from './components/LatestArrivals';
import FeaturedCategories from './components/FeaturedCategories';
// import VirtualTryOn from './pages/VirtualTryOn';

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

