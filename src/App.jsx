import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductsList from "./pages/ProductsList";
import Cart from "./pages/Cart";
import "./App.css";

function App() {
  const [showButton, setShowButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortFilter, setSortFilter] = useState("none");
  // const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const newWidth = window.innerWidth;
  //     if (newWidth !== screenWidth) {
  //       window.location.reload(); // Refresh the page when screen size changes
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [screenWidth]); // Re-run effect when screenWidth changes


  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 300px
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling animation
    });
  };

  // Handle search input
  const handleSearch = ({ query, category, sort }) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSortFilter(sort);
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <main>
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} sort={sortFilter} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products searchQuery={searchQuery} selectedCategory={selectedCategory} sort={sortFilter} />} />
          <Route path="/productsList" element={<ProductsList searchQuery={searchQuery} selectedCategory={selectedCategory} sort={sortFilter} />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </Router>
  );
}

export default App;
