import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import { useCart } from "../context/CartContext";


const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [originalUserData, setOriginalUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { setCartItemsDirectly } = useCart();

  const handleRepeatOrder = (order) => {
    // Преобразуем элементы заказа в формат для корзины
    const newCartItems = order.orderItems.map((item) => ({
      id: item.menuItem.id,
      name: item.menuItem.name,
      price: item.priceAtOrderTime,
      weight: item.menuItem.weight,
      quantity: item.quantity, // Устанавливаем точное количество из заказа
    }));
  
    // Устанавливаем новые элементы в корзину
    setCartItemsDirectly(newCartItems);
  
    // Перенаправление пользователя на страницу корзины
    navigate("/cart");
  };


  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData?.id;

    if (!userId) {
      console.error("Пользователь не авторизован");
      navigate("/login");
      return;
    }

    setUserData(authData);

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/${userId}/no-orders`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );
        const user = response.data;

        // Преобразуем ответ в ожидаемую структуру
        const userDataFormatted = {
          id: user.id,
          fullName: user.name,
          phone: user.phone,
          email: user.username,
          address: user.address,
        };
        setUserData(userDataFormatted);
        setOriginalUserData(userDataFormatted); // Сохраняем оригинальные данные
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }
    };

    // Загружаем заказы пользователя
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );
        const allOrders = response.data;

        // Фильтруем заказы по customerId
        const userOrders = allOrders.filter(
          (order) =>
            order.customerId === userId &&
            order.status !== "отменён" &&
            order.status !== "доставлен"
        );
        setCurrentOrders(userOrders);
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
      }
    };

    // Загружаем заказы пользователя
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/user-all/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );
        const allOrders = response.data;

        // Фильтруем только заказы со статусом "доставлен"
        const deliveredOrders = allOrders.filter(
          (order) => order.status === "доставлен" || order.status === "отменен"
        );

        // Сохраняем отфильтрованные заказы в состояние
        setOrderHistory(deliveredOrders);
      } catch (error) {
        console.error("Ошибка при загрузке истории заказов:", error);
      }
    };

    fetchOrderHistory();
    fetchUserData();
    fetchOrders();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const hasChanged = (fieldName) => {
    return userData[fieldName] !== originalUserData[fieldName];
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSave = async (fieldName) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const { id } = userData;

      // Подготовка данных для обновления
      const updatedData = {
        name: userData.fullName,
        username: userData.email,
        phone: userData.phone,
        address: userData.address,
      };

      const response = await axios.put(
        `http://localhost:8080/api/v1/users/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );

      console.log("Данные успешно обновлены");

      // Обновляем originalUserData
      setOriginalUserData({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
      });
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  const handleNextOrder = () => {
    setCurrentOrderIndex((prevIndex) =>
      prevIndex + 1 >= currentOrders.length ? 0 : prevIndex + 1
    );
  };

  const handlePreviousOrder = () => {
    setCurrentOrderIndex((prevIndex) =>
      prevIndex - 1 < 0 ? currentOrders.length - 1 : prevIndex - 1
    );
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
          <button onClick={() => navigate("/profile")}>Личный кабинет</button>
          <button onClick={() => navigate("/cart")}>Корзина</button>
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
          {hasChanged("fullName") && (
            <button onClick={() => handleSave("fullName")}>Сохранить</button>
          )}

          <h2>Телефон</h2>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
          />
          {hasChanged("phone") && (
            <button onClick={() => handleSave("phone")}>Сохранить</button>
          )}

          <h2>E-mail</h2>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          {hasChanged("email") && (
            <button onClick={() => handleSave("email")}>Сохранить</button>
          )}

          <h2>Адрес</h2>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
          />
          {hasChanged("address") && (
            <button onClick={() => handleSave("address")}>Сохранить</button>
          )}
        </div>

        {/* Текущие заказы */}
        <div className="current-order">
          <h2>Текущие заказы</h2>
          {currentOrders.length > 0 ? (
            <div className="order-card">
              <div className="order-card-header">
                <h3>
                  Заказ №{currentOrders[currentOrderIndex].id}
                  <span className="order-status">
                    {currentOrders[currentOrderIndex].status}
                  </span>
                </h3>
              </div>

              <div className="order-card-content">
                <p>Сумма: {currentOrders[currentOrderIndex].totalPrice} ₽</p>
                <p>
                  Адрес доставки:{" "}
                  {currentOrders[currentOrderIndex].deliveryAddress}
                </p>
                <h4>Состав заказа:</h4>
                <ul>
                  {currentOrders[currentOrderIndex].orderItems.map((item) => (
                    <li key={item.id}>
                      <strong>{item.menuItem.name}</strong> — {item.quantity}{" "}
                      шт. ({item.priceAtOrderTime} ₽)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-card-controls">
                <button onClick={handlePreviousOrder}>←</button>
                <button onClick={handleNextOrder}>→</button>
              </div>
            </div>
          ) : (
            <p>Нет текущих заказов</p>
          )}
        </div>
      </div>

      {/* История заказов */}
      <div className="order-history">
        <h2>История заказов</h2>
        {orderHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Время заказа</th>
                <th>Сумма</th>
                <th>Адрес</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.totalPrice} ₽</td>
                  <td>{order.deliveryAddress}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="view-order-button"
                      onClick={() => handleOpenModal(order)}
                    >
                      Посмотреть заказ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет доставленных заказов</p>
        )}
      </div>
      {isModalOpen && selectedOrder && (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={handleCloseModal}>
        ×
      </button>
      <div className="order-card">
        <div className="order-card-header">
          <h3>
            Заказ №{selectedOrder.id}
            <span className="order-status">{selectedOrder.status}</span>
          </h3>
        </div>
        <div className="order-card-content">
          <p>Сумма: {selectedOrder.totalPrice} ₽</p>
          <p>Адрес доставки: {selectedOrder.deliveryAddress}</p>
          <h4>Состав заказа:</h4>
          <ul>
            {selectedOrder.orderItems.map((item) => (
              <li key={item.id}>
                <strong>{item.menuItem.name}</strong> — {item.quantity} шт. ({item.priceAtOrderTime} ₽)
              </li>
            ))}
          </ul>
        </div>
        <button
  className="repeat-order-button"
  onClick={() => handleRepeatOrder(selectedOrder)}
>
  Повторить заказ
</button>


      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Profile;
