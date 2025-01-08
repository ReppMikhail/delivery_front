import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import { fetchDishes } from "../http/authService";
import { useCart } from "../context/CartContext";

const MainPage = () => {
  const navigate = useNavigate();

  const { cartItems, addToCart, removeFromCart } = useCart();
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false); // Состояние для выпадающего списка "О нас"
  const [filterCriteria, setFilterCriteria] = useState({
    maxPrice: "",
    minWeight: "",
  });

  // Загрузка блюд
  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      try {
        const data = await fetchDishes();
        setDishes(data);
        setFilteredDishes(data);
      } catch (error) {
        console.error("Ошибка загрузки блюд:", error);
        alert("Не удалось загрузить данные. Попробуйте позже.");
      }
      setLoading(false);
    };

    loadDishes();
  }, []);

  // Фильтрация по категории
  const handleCategoryClick = (category) => {
    const newCategory = category === activeCategory ? null : category;
    setActiveCategory(newCategory);

    if (newCategory) {
      const filtered = dishes.filter((dish) => dish.category === newCategory);
      setFilteredDishes(filtered);
    } else {
      setFilteredDishes(dishes);
    }
  };

  // Применение сортировки
  const applySorting = (sortKey) => {
    const sorted = [...filteredDishes].sort((a, b) => {
      if (sortKey === "priceAsc") return a.price - b.price;
      if (sortKey === "priceDesc") return b.price - a.price;
      return 0;
    });
    setFilteredDishes(sorted);
    setSortDropdownVisible(false); // Закрыть выпадающий список после выбора
  };

  // Применение фильтров
  const applyFilters = () => {
    let filtered = [...dishes];

    if (filterCriteria.maxPrice) {
      filtered = filtered.filter((dish) => dish.price <= filterCriteria.maxPrice);
    }

    if (filterCriteria.minWeight) {
      filtered = filtered.filter((dish) => dish.weight >= filterCriteria.minWeight);
    }

    setFilteredDishes(filtered);
    setFiltersVisible(false); // Скрыть окно фильтров после применения
  };

  // Обновление фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCartItemQuantity = (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="main-page">
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/main")}>Главная</button>

          {/* Выпадающее меню "О нас" */}
          
            <button onClick={() => setAboutDropdownVisible(!aboutDropdownVisible)}>
              О нас
            </button>
            {aboutDropdownVisible && (
              <div className="dropdown-popup">
                <button onClick={() => navigate("/about/system")}>О системе</button>
                <button onClick={() => navigate("/about/developers")}>О разработчиках</button>
              </div>
            )}
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/profile")}>Личный кабинет</button>
          <button onClick={() => navigate("/cart")}>Корзина</button>
        </div>
      </header>

      {/* Категории */}
      <div className="categories">
        <button
          className={activeCategory === "Закуски" ? "active" : ""}
          onClick={() => handleCategoryClick("Закуски")}
        >
          Закуски
        </button>
        <button
          className={activeCategory === "Суп" ? "active" : ""}
          onClick={() => handleCategoryClick("Суп")}
        >
          Супы
        </button>
        <button
          className={activeCategory === "Горячее" ? "active" : ""}
          onClick={() => handleCategoryClick("Горячее")}
        >
          Горячее
        </button>
        <button
          className={activeCategory === "Десерты" ? "active" : ""}
          onClick={() => handleCategoryClick("Десерты")}
        >
          Десерты
        </button>
        <button
          className={activeCategory === "Напиток" ? "active" : ""}
          onClick={() => handleCategoryClick("Напиток")}
        >
          Напитки
        </button>
        <button
          className={activeCategory === "Салат" ? "active" : ""}
          onClick={() => handleCategoryClick("Салат")}
        >
          Салаты
        </button>

        {/* Сортировка */}
        <div className="sort-dropdown-container">
          <button onClick={() => setSortDropdownVisible(!sortDropdownVisible)}>
            Сортировка
          </button>
          {sortDropdownVisible && (
            <div className="sort-dropdown">
              <button onClick={() => applySorting("priceAsc")}>По возрастанию цены</button>
              <button onClick={() => applySorting("priceDesc")}>По убыванию цены</button>
            </div>
          )}
        </div>

        {/* Фильтры */}
        <button onClick={() => setFiltersVisible(!filtersVisible)}>Фильтры</button>
        {filtersVisible && (
          <div className="filters">
            <label>
              Максимальная цена:
              <input
                type="number"
                name="maxPrice"
                value={filterCriteria.maxPrice}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Минимальный вес (г):
              <input
                type="number"
                name="minWeight"
                value={filterCriteria.minWeight}
                onChange={handleFilterChange}
              />
            </label>
            <button onClick={applyFilters}>Применить</button>
          </div>
        )}
      </div>

      {/* Раздел "Блюда" */}
      <h2>Блюда</h2>
      <div className="dishes">
        {loading ? (
          <p>Загрузка блюд...</p>
        ) : filteredDishes.length === 0 ? (
          <p>Блюда не найдены.</p>
        ) : (
          filteredDishes.map((dish) => {
            const quantity = getCartItemQuantity(dish.id);
            return (
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
                  <div className="dish-cart-actions">
                    {quantity > 0 ? (
                      <>
                        <button onClick={() => removeFromCart(dish.id)}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => addToCart(dish)}>+</button>
                      </>
                    ) : (
                      <button onClick={() => addToCart(dish)}>Добавить</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MainPage;
