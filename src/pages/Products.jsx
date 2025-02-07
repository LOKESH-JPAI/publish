import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { throttle } from "lodash";

const Products = ({ searchQuery, selectedCategory, sort }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setShowButton(window.scrollY > 300);
    }, 200); // Limit execution to every 200ms

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category and search query
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "price-asc") {
        return a.price - b.price;
      } else if (sort === "price-desc") {
        return b.price - a.price;
      } else if (sort === "rating-asc") {
        return a.rating - b.rating;
      } else if (sort === "rating-desc") {
        return b.rating - a.rating;
      } else if (sort === "name-asc") {
        return a.title.localeCompare(b.title);
      } else if (sort === "name-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0; // No sorting applied
    });

  return (
    <div className="container mt-4">
      <h2>All Products</h2>
      <div className="row">
        {searchQuery && filteredProducts.length === 0 ? (
          <p>No products found for "{searchQuery || selectedCategory}".</p>
        ) : (
          (filteredProducts).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
