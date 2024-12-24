import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./MainPage.css"; // Для стилизации (опционально)

const MainPage = () => {
  const navigate = useNavigate();

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  const dishes = [
    {
      id: 1,
      name: "Гункан лосось",
      weight: "40 г",
      ingredients: "Нори, рис, японский майонез, бальзамик, трюфельная сальса, кунжутное масло",
      price: 190,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Гункан креветка",
      weight: "40 г",
      ingredients: "Нори, рис, японский майонез, бальзамик, трюфельная сальса, кунжутное масло",
      price: 190,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Нигири угорь",
      weight: "40 г",
      ingredients: "Нори, рис, японский майонез, бальзамик, трюфельная сальса, кунжутное масло",
      price: 190,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Нигири угорь",
      weight: "252 г",
      ingredients: "Нори, рис, японский майонез, бальзамик, трюфельная сальса, кунжутное масло",
      price: 190,
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="main-page">
      {/* Навигационная панель */}
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/main")}>Главная</button>
          <button onClick={() => navigate("/about")}>О нас</button>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/profile")} className="profile-button">Личный кабинет</button>
          <button onClick={() => navigate("/cart")} className="cart-button">Корзина</button>
        </div>
      </header>

      {/* Категории */}
      <div className="categories">
        <button>Закуски</button>
        <button>Супы</button>
        <button>Горячее</button>
        <button>Десерты</button>
        <button>Напитки</button>
        <button>Салаты</button>
        <button onClick={() => setFiltersVisible(!filtersVisible)}>Фильтры</button>
        <button onClick={() => setSortVisible(!sortVisible)}>Сортировка</button>
      </div>

      {/* Раздел "Суши" */}
      <h2>Суши</h2>
      <div className="dishes">
        {dishes.map((dish) => (
          <div className="dish-card" key={dish.id}>
            <img src={dish.image} alt={dish.name} className="dish-image" />
            <h3 className="dish-name">{dish.name}</h3>
            <p className="dish-weight">Вес: {dish.weight}</p>
            <p className="dish-ingredients">{dish.ingredients}</p>
            <div className="dish-footer">
              <span className="dish-price">{dish.price} руб</span>
              <button className="add-to-cart">+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
