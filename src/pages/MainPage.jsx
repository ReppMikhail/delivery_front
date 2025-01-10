import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import { fetchDishes } from "../http/authService";
import { useCart } from "../context/CartContext";
import DishCard from "./DishCard";
import ImageComponent from "./ImageComponent";

const MainPage = () => {
  const navigate = useNavigate();

  const [selectedDish, setSelectedDish] = useState(null);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const categoryRefs = useRef({}); // Хранилище рефов для категорий

  // Загрузка блюд
  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      try {
        const data = await fetchDishes();
        setDishes(data);
      } catch (error) {
        console.error("Ошибка загрузки блюд:", error);
        alert("Не удалось загрузить данные. Попробуйте позже.");
      }
      setLoading(false);
    };

    loadDishes();
  }, []);

  const handleDishClick = (dish) => {
    setSelectedDish(dish); // Открываем карточку товара
    document.body.classList.add("modal-open"); // Блокируем скролл страницы
  };

  const closeDishCard = () => {
    setSelectedDish(null); // Закрываем карточку товара
    document.body.classList.remove("modal-open"); // Разрешаем скролл
  };

  const getCartItemQuantity = (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  const categoryTitles = {
    Суп: "Супы",
    Напиток: "Напитки",
    Десерт: "Десерты",
    Закуска: "Закуски",
    Салат: "Салаты",
    Горячее: "Горячее",
  };

  const getPluralCategoryName = (category) =>
    categoryTitles[category] || category;

  const getDishesByCategory = () => {
    const groupedDishes = {};
    dishes.forEach((dish) => {
      if (!groupedDishes[dish.category]) {
        groupedDishes[dish.category] = [];
      }
      groupedDishes[dish.category].push(dish);
    });
    return groupedDishes;
  };

  const scrollToCategory = (category) => {
    const ref = categoryRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="main-page">
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/main")}>Главная</button>
          <button onClick={() => navigate("/about/system")}>О системе</button>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/profile")}>Личный кабинет</button>
          <button onClick={() => navigate("/cart")}>Корзина</button>
        </div>
      </header>

      {/* Категории */}
      <div className="categories-container">
        <div className="categories">
          {Object.keys(categoryTitles).map((category) => (
            <button key={category} onClick={() => scrollToCategory(category)}>
              {getPluralCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Загрузка блюд...</p>
      ) : (
        <div className="dishes-by-category">
          {Object.entries(getDishesByCategory()).map(
            ([category, categoryDishes]) => (
              <div
                className="category-block"
                key={category}
                ref={(el) => (categoryRefs.current[category] = el)}
              >
                <h3 className="category-title">
                  {getPluralCategoryName(category)}
                </h3>
                <div className="dishes">
                  {categoryDishes.map((dish) => {
                    const quantity = getCartItemQuantity(dish.id);
                    return (
                      <div className="dish-card" key={dish.id}>
                        <ImageComponent
                          id={dish.id}
                          dish={dish}
                          className="dish-image"
                          onClick={() => handleDishClick(dish)}
                        />
                        <h3 className="dish-name">{dish.name}</h3>
                        <p className="dish-weight">Вес: {dish.weight} г</p>
                        <p className="dish-ingredients">
                          {dish.ingredients
                            .map((ingredient) => ingredient.name)
                            .join(", ")}
                        </p>
                        <div className="dish-footer">
                          <span className="dish-price">{dish.price} руб</span>
                          {quantity > 0 ? (
                            <>
                              <button
                                onClick={() => navigate("/cart")}
                                className="go-to-cart-button"
                              >
                                Перейти в корзину
                              </button>
                              <div className="dish-cart-actions">
                                <button class="minus-button"
                                onClick={() => removeFromCart(dish.id)}>
                                  -
                                </button>
                                <span>{quantity}</span>
                                <button className="plus-button"
                                onClick={() => addToCart(dish)}>
                                  +
                                </button>
                              </div>
                            </>
                          ) : (
                            <button className="add-button"
                            onClick={() => addToCart(dish)}>
                              Добавить
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Карточка товара поверх контента */}
      {selectedDish && (
        <>
          {/* Затемнение фона */}
          <div className="modal-overlay" onClick={closeDishCard}></div>

          {/* Карточка товара */}
          <DishCard
            dish={selectedDish}
            onClose={closeDishCard}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            quantity={getCartItemQuantity(selectedDish.id)}
            navigate={navigate} // передаем navigate в DishCard
          />
        </>
      )}
    </div>
  );
};

export default MainPage;
