import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getUserById,
  getAllCouriers,
  getAllCustomers,
  getAllManagers,
  updateUser,
} from "../http/adminService";
import "./Profile.css";
import { useCart } from "../context/CartContext";
import ValidationHelper from "../components/ValidationHelper"; // Импорт валидации
import NavigationBar from "../components/NavigationBar";

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
  const [isFieldChanged, setIsFieldChanged] = useState({});
  const [isAnyFieldChanged, setIsAnyFieldChanged] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFieldChangeState = (fieldName, hasChanged) => {
    const updatedFieldState = { ...isFieldChanged, [fieldName]: hasChanged };
    setIsFieldChanged(updatedFieldState);

    // Проверяем, изменено ли больше одного поля
    const changedFields = Object.values(updatedFieldState).filter(Boolean);
    setIsAnyFieldChanged(changedFields.length > 1);
  };

  const handleRepeatOrder = async (order) => {
    try {
      // Запрашиваем список архивных блюд
      const authData = JSON.parse(localStorage.getItem("authData"));
      const response = await axios.get(
        "http://localhost:8080/api/v1/menuitems/archive",
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );
      const archivedItems = response.data;
  
      // Проверяем, содержит ли заказ архивные блюда
      const unavailableItems = order.orderItems.filter((item) =>
        archivedItems.some((archived) => archived.id === item.menuItem.id)
      );
  
      if (unavailableItems.length > 0) {
        // Формируем сообщение с перечнем недоступных блюд
        const itemNames = unavailableItems
          .map((item) => item.menuItem.name)
          .join(", ");
        alert(
          `Невозможно повторить заказ. Следующие блюда больше недоступны: ${itemNames}`
        );
        return;
      }
  
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
    } catch (error) {
      console.error("Ошибка при проверке доступности блюд:", error);
      alert("Произошла ошибка при повторе заказа. Попробуйте позже.");
    }
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
            order.status !== "отменен" &&
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
    const updatedData = { ...userData, [name]: value };
    setUserData(updatedData);

    const hasChanged = updatedData[name] !== originalUserData[name];
    updateFieldChangeState(name, hasChanged);

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case "fullName":
        error = ValidationHelper.validateName(value);
        break;
      case "phone":
        error = ValidationHelper.validatePhone(value);
        break;
      case "email":
        error = ValidationHelper.validateEmail(value);
        break;
      case "address":
        error = ValidationHelper.validateAddress(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSave = async () => {
    // Проверка на наличие ошибок перед сохранением
    const newErrors = {};
    Object.keys(userData).forEach((field) => {
      const error = validateField(field, userData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const { id } = userData;

      // Загружаем всех пользователей
      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);

      const adminUser = getUserById(1);

      const allUsers = [...customers, ...managers, ...couriers];
      allUsers.push(adminUser);

      // Проверяем уникальность логина
      const isUsernameTaken = allUsers.some(
        (user) => user.username === userData.email && user.id !== id
      );

      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        return;
      }

      const updatedData = {
        name: userData.fullName,
        username: userData.email,
        phone: userData.phone,
        address: userData.address,
      };

      await axios.put(`http://localhost:8080/api/v1/users/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      });

      console.log("Данные успешно обновлены");

      if (userData.email !== originalUserData.email) {
        localStorage.removeItem("authData"); // Удаляем данные авторизации
        alert("Логин успешно обновлен! Выполните вход с новым логином.");
        navigate("/"); // Перенаправление на страницу авторизации
      } else {
        setOriginalUserData({ ...userData });
        setIsFieldChanged({});
        setIsAnyFieldChanged(false);
      }
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

  return (
    <div className="profile-page">
      <NavigationBar></NavigationBar>

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
          {errors.fullName && (
            <p className="error-message">{errors.fullName}</p>
          )}
          {isFieldChanged.fullName &&
            !isAnyFieldChanged &&
            !errors.fullName && <button onClick={handleSave}>Сохранить</button>}

          <h2>Телефон</h2>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
          {isFieldChanged.phone && !isAnyFieldChanged && !errors.phone && (
            <button onClick={handleSave}>Сохранить</button>
          )}

          <h2>E-mail</h2>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          {isFieldChanged.email && !isAnyFieldChanged && !errors.email && (
            <button onClick={handleSave}>Сохранить</button>
          )}

          <h2>Адрес</h2>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
          {isFieldChanged.address && !isAnyFieldChanged && !errors.address && (
            <button onClick={() => handleSave}>Сохранить</button>
          )}

          {isAnyFieldChanged && (
            <div className="save-all-container">
              <button
                className="save-all-button"
                onClick={handleSave}
                disabled={Object.values(errors).some(Boolean)}
              >
                Сохранить изменения
              </button>
            </div>
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
                      <strong>{item.menuItem.name}</strong> — {item.quantity}{" "}
                      шт. ({item.priceAtOrderTime} ₽)
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
