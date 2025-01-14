import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import { fetchDishes } from "../http/authService";
import { useCart } from "../context/CartContext";
import DishCard from "./DishCard";
import ImageComponent from "./ImageComponent";
import NavigationBar from "../components/NavigationBar";

const MainPage = () => {
  const navigate = useNavigate();

  const [selectedDish, setSelectedDish] = useState(null);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const categoryRefs = useRef({}); // Хранилище рефов для категорий
  const [sortOption, setSortOption] = useState("default"); // Состояние для сортировки
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ingredients, setIngredients] = useState([]); // Список ингредиентов
const [excludedIngredients, setExcludedIngredients] = useState([]); // Выбранные ингредиенты
const [kitchens, setKitchens] = useState([]); // Список кухонь
const [selectedKitchens, setSelectedKitchens] = useState([]); // Выбранные кухни
const [tempMinPrice, setTempMinPrice] = useState("");
const [tempMaxPrice, setTempMaxPrice] = useState("");
const [tempExcludedIngredients, setTempExcludedIngredients] = useState([]);
const [tempSelectedKitchens, setTempSelectedKitchens] = useState([]);
const [searchText, setSearchText] = useState(""); // Состояние для строки поиска


  // Загрузка блюд
  useEffect(() => {

    const loadKitchens = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("authData"));
        const token = authData?.accessToken;
        if (!token) {
          throw new Error("Токен авторизации отсутствует");
        }
  
        const response = await fetch("http://localhost:8080/api/v1/kitchens", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
  
        const data = await response.json();
        setKitchens(data);
      } catch (error) {
        console.error("Ошибка загрузки кухонь:", error);
      }
    };
  
    loadKitchens();

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

    const loadIngredients = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("authData"));
        const token = authData?.accessToken;
        if (!token) {
          throw new Error("Токен авторизации отсутствует");
        }
    
        const response = await fetch("http://localhost:8080/api/v1/ingredients", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
    
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error("Ошибка загрузки ингредиентов:", error);
      }
    };
    
    loadIngredients();
  }, []);

  const handleSortChange = (option) => {
    setSortOption(option);
    setSortDropdownVisible(false); // Закрыть список после выбора
  };

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
    Основное: "Основные блюда", // Заменили Горячее на Основное блюдо
    Гарнир: "Гарниры", // Добавили новую категорию Гарнир
  };
  

  const getPluralCategoryName = (category) =>
    categoryTitles[category] || category;

  const getDishesByCategory = () => {
    const filteredDishes = dishes.filter((dish) => {
      const price = dish.price;
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
  
      // Проверка на ингредиенты
      const containsExcludedIngredient = dish.ingredients.some((ingredient) =>
        excludedIngredients.includes(ingredient.name)
      );

      // Проверка на кухни
    const isKitchenSelected =
    selectedKitchens.length === 0 || selectedKitchens.includes(dish.kitchen?.name);

    const matchesSearch = dish.name
    .toLowerCase()
    .includes(searchText.toLowerCase()); // Проверка на соответствие строке поиска
  
    return (
      price >= min &&
      price <= max &&
      !containsExcludedIngredient &&
      isKitchenSelected &&
      matchesSearch
    );
  });
  
    const groupedDishes = {};
    filteredDishes.forEach((dish) => {
      if (!groupedDishes[dish.category]) {
        groupedDishes[dish.category] = [];
      }
      groupedDishes[dish.category].push(dish);
    });
  
    // Применяем сортировку
    for (const category in groupedDishes) {
      groupedDishes[category] = sortDishes(groupedDishes[category]);
    }
  
    return groupedDishes;
  };
  

  const sortDishes = (dishes) => {
    switch (sortOption) {
      case "priceAsc":
        return [...dishes].sort((a, b) => a.price - b.price);
      case "priceDesc":
        return [...dishes].sort((a, b) => b.price - a.price);
      case "weightAsc":
        return [...dishes].sort((a, b) => a.weight - b.weight);
      case "weightDesc":
        return [...dishes].sort((a, b) => b.weight - a.weight);
      default:
        return dishes;
    }
  };

  const scrollToCategory = (category) => {
    const ref = categoryRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const applyFilters = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setExcludedIngredients(tempExcludedIngredients);
    setSelectedKitchens(tempSelectedKitchens);
    setFilterModalVisible(false);
};

const resetFilters = () => {
  setTempMinPrice("");
  setTempMaxPrice("");
  setTempExcludedIngredients([]);
  setTempSelectedKitchens([]);
};



  return (
    <div className="main-page">
      <NavigationBar />

      {/* Категории */}
      <div className="categories-container">
        <div className="categories">
          {Object.keys(categoryTitles).map((category) => (
            <button key={category} onClick={() => scrollToCategory(category)}>
              {getPluralCategoryName(category)}
            </button>
          ))}
          <div className="filters">
            <button className="filter-button" onClick={toggleFilterModal}>
              Фильтры
            </button>
          </div>

          {/* Кнопка сортировки */}
          <div className="sort-dropdown">
            <button
              className={`sort-button ${
                sortOption !== "default" ? "active-sort" : ""
              }`}
              onClick={() => setSortDropdownVisible(!sortDropdownVisible)}
            >
              Сортировка
            </button>
            {sortDropdownVisible && (
              <div className="sort-options">
                <button onClick={() => handleSortChange("default")}>
                  По умолчанию
                </button>
                <button onClick={() => handleSortChange("priceAsc")}>
                  Цена: по возрастанию
                </button>
                <button onClick={() => handleSortChange("priceDesc")}>
                  Цена: по убыванию
                </button>
                <button onClick={() => handleSortChange("weightAsc")}>
                  Вес: по возрастанию
                </button>
                <button onClick={() => handleSortChange("weightDesc")}>
                  Вес: по убыванию
                </button>
              </div>
            )}
          </div>

          <input
            className="search-dishes-input"
            type="text"
            placeholder="Поиск блюда"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getDishesByCategory();
              }
            }}
          />
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
                                <button
                                  class="minus-button"
                                  onClick={() => removeFromCart(dish.id)}
                                >
                                  -
                                </button>
                                <span>{quantity}</span>
                                <button
                                  className="plus-button"
                                  onClick={() => addToCart(dish)}
                                >
                                  +
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              className="add-button"
                              onClick={() => addToCart(dish)}
                            >
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

{filterModalVisible && (
  <>
    <div className="modal-overlay" onClick={toggleFilterModal}></div>
    <div className="filter-modal">
      <h3>Фильтры</h3>

      {/* Фильтр по цене */}
      <label>
    Минимальная цена:
    <input
        type="number"
        value={tempMinPrice}
        onChange={(e) => setTempMinPrice(e.target.value)}
        placeholder="0"
    />
</label>
<label>
    Максимальная цена:
    <input
        type="number"
        value={tempMaxPrice}
        onChange={(e) => setTempMaxPrice(e.target.value)}
        placeholder="1000"
    />
</label>

      {/* Фильтр по ингредиентам */}
      <div className="ingredient-filters">
  <h4>Исключить ингредиенты:</h4>
  <div className="ingredient-list">
    {ingredients.map((ingredient) => (
      <label key={ingredient.id}>
        <input
                type="checkbox"
                checked={tempExcludedIngredients.includes(ingredient.name)}
                onChange={() => {
                    setTempExcludedIngredients((prev) =>
                        prev.includes(ingredient.name)
                            ? prev.filter((name) => name !== ingredient.name)
                            : [...prev, ingredient.name]
                    );
                }}
            />
        {ingredient.name}
      </label>
    ))}
  </div>

  <div className="kitchen-filters">
  <h4>Выбрать кухни:</h4>
  <div className="kitchen-list">
    {kitchens.map((kitchen) => (
      <label key={kitchen.id}>
        <input
                type="checkbox"
                checked={tempSelectedKitchens.includes(kitchen.name)}
                onChange={() => {
                    setTempSelectedKitchens((prev) =>
                        prev.includes(kitchen.name)
                            ? prev.filter((name) => name !== kitchen.name)
                            : [...prev, kitchen.name]
                    );
                }}
            />
        {kitchen.name}
      </label>
    ))}
  </div>
</div>

</div>


      <div className="modal-actions">
        <button onClick={applyFilters}>Применить</button>
        <button onClick={resetFilters}>Сбросить</button>
        <button onClick={toggleFilterModal}>Закрыть</button>
      </div>
    </div>
  </>
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