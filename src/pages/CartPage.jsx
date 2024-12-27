import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  const handleIncreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    // Отправка заказа менеджеру (эмуляция)
    console.log("Order placed:", cartItems);
    alert("Ваш заказ оформлен и отправлен менеджеру!");
    setCartItems([]); // Очистка корзины после оформления заказа
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="cart-page">
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/main")}>Главная</button>
          <button onClick={() => navigate("/about")}>О нас</button>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/profile")} className="profile-button">
            Личный кабинет
          </button>
        </div>
      </header>

      <h1>
        Корзина <span>{totalItems} шт</span>
      </h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.weight} г</p>
            </div>
            <div className="cart-item-price">{item.price} ₽</div>
            <div className="cart-item-quantity">
              <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
              <span>{item.quantity} шт</span>
              <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
            </div>
            <div className="cart-item-total">
              {item.price * item.quantity} ₽
            </div>
            <button
              className="cart-item-remove"
              onClick={() => handleRemoveItem(item.id)}
            >
              &#10006;
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div>Итого к оплате: {totalPrice} ₽</div>
        <button onClick={handlePlaceOrder} className="place-order-button">
          Оформить заказ
        </button>
      </div>
    </div>
  );
};

export default CartPage;