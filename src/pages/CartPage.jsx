import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import { useCart } from "../context/CartContext";
import { createOrder } from "../http/orderService"; // Импорт функции для создания заказа

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, deleteFromCart, clearCart } = useCart();

  const handleIncreaseQuantity = (item) => {
    addToCart(item);
  };

  const handleDecreaseQuantity = (id) => {
    removeFromCart(id);
  };

  const handleRemoveItem = (id) => {
    deleteFromCart(id);
  };

  const handlePlaceOrder = async () => {
    try {
      // Получение данных пользователя из localStorage
      const authData = JSON.parse(localStorage.getItem("authData"));
      const customerId = authData?.id; // Извлечение customerId из сохранённых данных
  
      if (!customerId) {
        alert("Не удалось определить пользователя. Войдите в аккаунт.");
        return;
      }
  
      // Подготовка данных для отправки заказа
      const orderData = {
        customerId, // ID клиента
        status: "в обработке", // Начальный статус заказа
        totalPrice: cartItems.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        ),
        paymentMethod: "Карта", // Или другой способ оплаты
        paymentStatus: "Не оплачено",
        orderItems: cartItems.map((item) => ({
          menuItem: { id: item.id }, // ID позиции из меню
          quantity: item.quantity,
          priceAtOrderTime: item.price,
        })),
        deliveryAddress: "Адрес доставки клиента", // Укажите логическое значение, как адрес по умолчанию
      };
  
      // Отправка заказа через orderService
      const createdOrder = await createOrder(orderData);
  
      alert(`Ваш заказ оформлен! Номер заказа: ${createdOrder.id}`);
      clearCart(); // Очищаем корзину после успешного оформления
      navigate("/main"); // Перенаправляем пользователя на главную страницу
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      alert("Не удалось оформить заказ. Попробуйте снова.");
    }
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
              <button onClick={() => handleIncreaseQuantity(item)}>+</button>
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
