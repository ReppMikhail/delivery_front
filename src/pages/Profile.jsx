import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./Profile.css";

const initialUserData = {
  fullName: "Иван Иванов",
  phone: "8 912 345-67-89",
  email: "ivanov@yandex.ru",
  address: "Ул. Арцыбушевская, д. 55, кв. 16",
};

const initialCurrentOrder = [
  {
    id: 1,
    name: "Хачапури по-аджарски",
    weight: 400,
    price: 425,
    quantity: 1,
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Ланч низкокалорийный",
    weight: 500,
    price: 525,
    quantity: 1,
    imageUrl: "https://via.placeholder.com/150",
  },
];

const initialOrderHistory = [
  { id: 426, date: "26 окт. 2024 г., 15:01", total: 827 },
  { id: 425, date: "25 окт. 2024 г., 14:22", total: 1125 },
  { id: 424, date: "24 окт. 2024 г., 13:15", total: 920 },
];

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialUserData);
  const [currentOrder] = useState(initialCurrentOrder);
  const [orderHistory] = useState(initialOrderHistory);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleViewOrder = (orderId) => {
    // Симуляция загрузки данных заказа в корзину
    console.log(`Загружаем заказ с ID: ${orderId}`);
    navigate("/cart", { state: { orderId } });
  };

  return (
    <div className="profile-page">
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/main")}>Главная</button>
          <button onClick={() => navigate("/about")}>О нас</button>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button
            onClick={() => navigate("/cart")}
            className="cart-button"
          >
            Корзина
          </button>
        </div>
      </header>

      <h1>Личный кабинет</h1>

      <div className="profile-container">
        {/* Личные данные */}
        <div className="profile-data">
          <h2>ФИО</h2>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleInputChange}
          />

          <h2>Телефон</h2>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
          />

          <h2>E-mail</h2>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />

          <h2>Адрес</h2>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
          />
        </div>

        {/* Текущий заказ */}
        <div className="current-order">
          <h2>Текущий заказ</h2>
          <div className="order-items">
            {currentOrder.map((item) => (
              <div className="order-item" key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.weight} г</p>
                </div>
                <div className="order-item-quantity">{item.quantity} шт</div>
                <div className="order-item-price">{item.price} ₽</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* История заказов */}
      <div className="order-history">
        <h2>История заказов</h2>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Время заказа</th>
              <th>Сумма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.total} ₽</td>
                <td>
                  <button
                    className="view-order-button"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    Посмотреть заказ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
