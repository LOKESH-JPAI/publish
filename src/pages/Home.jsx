import React, { useRef, useState, useEffect } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

const Home = ({ searchQuery, selectedCategory, sort }) => {
 
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
        const rateA = a.rating?.rate ?? 0; // Safely access rate or default to 0
        const rateB = b.rating?.rate ?? 0; // Safely access rate or default to 0
        return rateA - rateB; // Compare 'rate' property for sorting by rating
      } else if (sort === "rating-desc") {
        const rateA = a.rating?.rate ?? 0; // Safely access rate or default to 0
        const rateB = b.rating?.rate ?? 0; // Safely access rate or default to 0
        return rateB - rateA; // Compare 'rate' property for sorting by rating
      } else if (sort === "name-asc") {
        return a.title.localeCompare(b.title);
      } else if (sort === "name-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0; // No sorting applied
    });

  return (
    <div className="container mt-4">
      <h1>Home Page</h1>
      <div className="row">
        {filteredProducts.map((product) => (
         <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
