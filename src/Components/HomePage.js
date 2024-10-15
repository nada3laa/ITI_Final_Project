import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Header from "./Header";
import Popular from "./Popular";
import { CartProvider } from "react-use-cart";
import Carousel from "./Carousel";
import New from "./New";
import Sale from "./Sale";
import Testimonials from "./Testimonials";
import Suscribe from "./Suscribe";
import Footer from "./Footer";
import ScrollToTop from "react-scroll-to-top";
import { useLocation } from "react-router";

const HomePage = () => {
  const { pathname } = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

 
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

 
  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      alert("You must be logged in to add products to the cart. Please log in or register.");
      return; 
    }

  
  };

  return (
    <CartProvider>
      <NavBar />
      <Header />
      <Popular products={products} onAddToCart={handleAddToCart} /> 
      <Carousel />
      <New products={products} onAddToCart={handleAddToCart} /> 
      <Sale products={products} onAddToCart={handleAddToCart} /> 
      <Testimonials products={products} categories={categories} />
      <Suscribe />
      <Footer />
      <ScrollToTop
        smooth
        component={
          <img
            src="/image/logo.jpg"
            alt="Logo"
            style={{ width: "100%", height: "100%" }}
          />
        }
        style={{ backgroundColor: "#fff", width: "60px", height: "60px" }}
        className="animate__animated animate__flash animate__infinite infinite animate__slower"
      />
    </CartProvider>
  );
};

export default HomePage;
