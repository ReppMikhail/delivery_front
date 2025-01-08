import React from "react";
import "./DishCard.css";

const DishCard = ({ dish, onClose }) => {
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
          <img
            src={dish.imageUrl || "https://via.placeholder.com/150"}
            alt={dish.name}
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
          <button className="quantity-button">-</button>
          <span className="quantity">1 шт</span>
          <button className="quantity-button">+</button>
        </div>
        <div className="dish-price">
          <span>{dish.price} ₽</span>
          <button className="add-to-cart">Добавить в корзину</button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
