import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaShoppingCart,
  FaHome,
  FaListAlt,
  FaSearch,
  FaTimes,
  FaBars,
  FaChartBar,
} from "react-icons/fa";
import products from "../data/products";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState("none");

  const categories = [
    "all",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const handleNavbarToggle = () => setIsNavbarOpen(!isNavbarOpen);
  const handleSearchClick = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    onSearch({ query: searchQuery, category: newCategory, sort: sortFilter });
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortFilter(newSortOption);
    onSearch({ query: searchQuery, category: selectedCategory, sort: newSortOption });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: searchQuery, category: selectedCategory });
    setIsSearchOpen(false);
  };

  const handleLinkClick = () => setIsNavbarOpen(false);

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-primary">
      <div className="container-fluid">
        {!isSearchOpen && (
          <Link className="navbar-brand" to="/">
            E-Commerce
          </Link>
        )}

        {!isSearchOpen && (
          <button className="btn btn-outline-light border-0 d-lg-none ms-auto" onClick={handleSearchClick}>
            <FaSearch />
          </button>
        )}

        {!isSearchOpen && (
          <button className="navbar-toggler" type="button" onClick={handleNavbarToggle}>
            <FaBars />
          </button>
        )}

        <div className={`mobile-search-bar w-100 d-lg-none ${isSearchOpen ? "d-flex" : "d-none"}`}>
          <form className="w-100 d-flex" onSubmit={handleSearchSubmit}>
            <div className="input-group rounded">
              <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <input className="form-control w-auto" type="search" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} />
              <button className="btn btn-outline-light" type="submit">
                <FaSearch />
              </button>
            </div>
            <button className="btn btn-danger ms-2" type="button" onClick={handleSearchClose}>
              <FaTimes />
            </button>
          </form>
        </div>

        <div className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""} ${isSearchOpen ? "d-none" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" activeClassName="active" onClick={handleLinkClick}>
                <FaHome className="me-2" /> Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/productsList" activeClassName="active" onClick={handleLinkClick}>
                <FaListAlt className="me-2" /> Products Category
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/products" activeClassName="active" onClick={handleLinkClick}>
                <FaListAlt className="me-2" /> Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/cart" activeClassName="active" onClick={handleLinkClick}>
                <FaShoppingCart className="me-2" /> Cart
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard" activeClassName="active" onClick={handleLinkClick}>
                <FaChartBar className="me-2" /> Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/login" activeClassName="active" onClick={handleLinkClick}>
                <FaChartBar className="me-2" /> Login
              </NavLink>
            </li>

            <li className="nav-item d-none d-lg-block">
              <form className="d-flex" onSubmit={handleSearchSubmit}>
                <div className="input-group border border-secondary rounded">
                  <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <input className="form-control w-auto" type="search" placeholder="Search products" value={searchQuery} onChange={handleSearchChange} />
                  <button className="btn btn-primary" type="submit">
                    <FaSearch />
                  </button>
                </div>
              </form>
            </li>

            <li className="nav-item mx-2">
              <select className="form-select" id="sortSelect" value={sortFilter} onChange={handleSortChange}>
                <option value="none">None</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
