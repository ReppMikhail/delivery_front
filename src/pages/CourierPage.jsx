import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByCustomerId } from "../http/orderService";
import axios from "axios"; // Для работы с сервером
import "./Courier.css";

function CourierPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]); // Для заказов со статусом "назначен курьер"
  const [inProgressOrders, setInProgressOrders] = useState([]); // Для заказов со статусом "в пути"
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const authData = JSON.parse(localStorage.getItem("authData"));
        const courierId = authData?.id;
        if (!courierId) throw new Error("Courier ID not found in localStorage");

        const fetchedOrders = await getOrdersByCustomerId(4); // Замените на нужный customerId, если нужно

        // Разделяем заказы на два списка в зависимости от их статуса
        const filteredPendingOrders = fetchedOrders.filter(
          (order) => order.status === "назначен курьер" // && order.courierId === courierId // это когда апи будет готово
        );

        const filteredInProgressOrders = fetchedOrders.filter(
          (order) => order.status === "в пути" // && order.courierId === courierId // это когда апи будет готово
        );

        // Обновляем состояние
        setPendingOrders(filteredPendingOrders);
        setInProgressOrders(filteredInProgressOrders);
      } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRejectOrder = async (orderId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const token = authData?.accessToken; // Используем accessToken
      if (!token) throw new Error("Токен авторизации отсутствует");

      await axios.put(
        `http://localhost:8080/api/v1/orders/${orderId}/prepare`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPendingOrders(pendingOrders.filter((order) => order.id !== orderId));
      console.log(`Заказ ${orderId} отклонён и переведён в статус "готовится".`);
    } catch (error) {
      console.error(`Ошибка при обновлении заказа ${orderId}:`, error.message);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const courierId = authData?.id;
      const token = authData?.accessToken; // Используем accessToken
      if (!token) throw new Error("Токен авторизации отсутствует");

      // Отправляем запрос на сервер для завершения заказа
      await axios.put(
        `http://localhost:8080/api/v1/couriers/${courierId}/end-order`, // Отправляем запрос с ID курьера
        { id: orderId }, // Передаем ID заказа в теле запроса
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Обновляем состояние, чтобы отобразить изменения (удаляем завершённый заказ)
      setInProgressOrders(inProgressOrders.filter((order) => order.id !== orderId));
      console.log(`Заказ ${orderId} завершён и переведён в статус "Доставлен".`);
    } catch (error) {
      console.error(`Ошибка при завершении заказа ${orderId}:`, error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    // Здесь добавьте логику отмены заказа, если это нужно.
    // Например, можно отправить запрос на сервер для изменения статуса на "Отменён".
  };

  const handleNextOrder = () => {
    if (currentOrderIndex < inProgressOrders.length - 1) {
      setCurrentOrderIndex(currentOrderIndex + 1);
    }
  };

  const handlePreviousOrder = () => {
    if (currentOrderIndex > 0) {
      setCurrentOrderIndex(currentOrderIndex - 1);
    }
  };

  const currentOrder =
    inProgressOrders.length > 0 ? inProgressOrders[currentOrderIndex] : null;

  return (
    <div className="courier-page">
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/about")}>О нас</button>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/courier")}>Заказы</button>
        </div>
      </header>

      <div className="content">
        {loading ? (
          <p>Загрузка заказов...</p>
        ) : (
          <>
            <div className="left-column">
              <h2>Назначенные курьеру заказы</h2>
              {pendingOrders.length === 0 ? (
                <p>Нет заказов со статусом "назначен курьер".</p>
              ) : (
                <div className="orders-list">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <h3>Заказ #{order.id}</h3>
                      <p>
                        {order.orderItems
                          .map(
                            (item) => `${item.menuItem.name} x ${item.quantity}`
                          )
                          .join(", ")}
                      </p>
                      <p>
                        Общий вес:{" "}
                        {order.orderItems.reduce(
                          (acc, item) =>
                            acc + item.menuItem.weight * item.quantity,
                          0
                        )}{" "}
                        г
                      </p>
                      <p>Сумма: {order.totalPrice.toFixed(2)} ₽</p>
                      <p>
                        Время заказа:{" "}
                        {order.orderTime
                          ? new Date(order.orderTime).toLocaleTimeString()
                          : "Не указано"}
                      </p>
                      <p>Адрес доставки: {order.deliveryAddress}</p>
                      <div className="buttons">
                        <button
                          className="reject-button"
                          onClick={() => handleRejectOrder(order.id)}
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="right-column">
              <h2>Заказы в пути</h2>

              <div className="current-order">
                {currentOrder ? (
                  <>
                    <h3>Текущий заказ {currentOrder.id}</h3>
                    <p>
                      {currentOrder.orderItems
                        .map(
                          (item) => `${item.menuItem.name} x ${item.quantity}`
                        )
                        .join(", ")}
                    </p>
                    <textarea
                      className="textarea"
                      placeholder="Комментарий..."
                    />
                    <p>Сумма: {currentOrder.totalPrice.toFixed(2)} ₽</p>
                    <p>Адрес доставки: {currentOrder.deliveryAddress}</p>
                    <div className="arrow-buttons">
                      <button onClick={handlePreviousOrder}>&uarr;</button>
                      <button onClick={handleNextOrder}>&darr;</button>
                    </div>
                    <div className="order-actions">
                      <button
                        className="complete-button"
                        onClick={() => handleCompleteOrder(currentOrder.id)}
                      >
                        Завершить
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelOrder(currentOrder.id)}
                      >
                        Отменить
                      </button>
                    </div>
                  </>
                ) : (
                  <h3>Выберите заказ для доставки</h3>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CourierPage;
