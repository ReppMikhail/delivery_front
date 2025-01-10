import React from "react";
import "./DishCard.css";
import ImageComponent from "./ImageComponent";

const DishCard = ({ dish, onClose, addToCart, removeFromCart, quantity, navigate }) => {
  if (!dish) return null;

  return (
    <div className="dish-card-popup">
      <div className="dish-card-header">
        <button className="close-button" onClick={onClose}>Назад</button>
        <h2 className="dish-title">{dish.name}</h2>
        <span className="dish-category">Японская</span>
      </div>
      <div className="dish-content">
        <div className="dish-image-description">
          <ImageComponent
            id={dish.id}
            dish={dish}
            className="dish-image"
          />
          <div className="dish-description">
            <h3>Описание</h3>
            <p>{dish.description}</p>
          </div>
        </div>
        <div className="dish-details">
          <p><strong>Калорийность:</strong> {dish.calories} ккал</p>
          <p><strong>Вес:</strong> {dish.weight} г</p>
          <p><strong>Состав:</strong> {dish.ingredients.map(i => i.name).join(", ")}</p>
        </div>
      </div>
      <div className="dish-footer">
        <div className="dish-quantity-control">
          <button
            className="minus-button"
            onClick={() => removeFromCart(dish.id)}
            disabled={quantity === 0} // Блокируем "-" при количестве 0
          >
            -
          </button>
          <span className="quantity">{quantity} шт</span>
          <button
            className="plus-button"
            onClick={() => addToCart(dish)}
          >
            +
          </button>
        </div>
        <div className="dish-price">
          <span>{dish.price * quantity} ₽</span>
          {/* Изменение текста кнопки в зависимости от наличия блюда в корзине */}
          {quantity > 0 ? (
            <button
              className="go-to-cart-button"
              onClick={() => navigate("/cart")} // Переход в корзину
            >
              Перейти в корзину
            </button>
          ) : (
            <button
              className="add-to-cart"
              onClick={() => addToCart(dish)}
            >
              Добавить в корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
