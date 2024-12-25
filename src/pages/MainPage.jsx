import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./MainPage.css"; // Для стилизации (опционально)
import { fetchDishes } from "../http/authService";

const MainPage = () => {
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await fetchDishes();
        setDishes(data);
      } catch (error) {
        console.error("Ошибка загрузки блюд:", error);
        alert("Не удалось загрузить данные. Попробуйте позже.");
      }
    };

    loadDishes();
  }, []);

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

      {/* Раздел "Блюда" */}
      <h2>Блюда</h2>
      <div className="dishes">
        {dishes.length === 0 ? (
          <p>Загрузка блюд...</p>
        ) : (
          dishes.map((dish) => (
            <div className="dish-card" key={dish.id}>
              <img
                src={dish.imageUrl || "https://via.placeholder.com/150"}
                alt={dish.name}
                className="dish-image"
              />
              <h3 className="dish-name">{dish.name}</h3>
              <p className="dish-weight">Вес: {dish.weight} г</p>
              <p className="dish-ingredients">
                {dish.ingredients.map((ingredient) => ingredient.name).join(", ")}
              </p>
              <div className="dish-footer">
                <span className="dish-price">{dish.price} руб</span>
                <button className="add-to-cart">+</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
