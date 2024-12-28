import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByCustomerId } from "../http/orderService"; // Предполагаем, что путь корректный
import "./Courier.css";

function CourierPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const userId = 4; // Замените на актуальный ID пользователя

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const authData = JSON.parse(localStorage.getItem("authData"));
        const courierId = authData?.id;
        if (!courierId) throw new Error("Courier ID not found in localStorage");

        const fetchedOrders = await getOrdersByCustomerId(userId);
        // Фильтруем заказы по статусу "назначен курьер" и соответствующему courierId
        const filteredOrders = fetchedOrders.filter(
          (order) => order.status === "назначен курьер"
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAcceptOrder = (orderId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "На доставке" } : order
    );
    setOrders(updatedOrders);

    const acceptedOrder = orders.find((order) => order.id === orderId);
    setAcceptedOrders([...acceptedOrders, acceptedOrder]);

    console.log(`Заказ ${orderId} принят курьером.`);
  };

  const handleRejectOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);

    console.log(`Заказ ${orderId} отклонён курьером.`);
  };

  const handleCompleteOrder = (orderId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "Доставлен" } : order
    );
    setOrders(updatedOrders);
    setAcceptedOrders(
      acceptedOrders.filter((order) => order.id !== orderId)
    );
    setCurrentOrderIndex(0);

    console.log(`Заказ ${orderId} завершён.`);
  };

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    setAcceptedOrders(
      acceptedOrders.filter((order) => order.id !== orderId)
    );
    setCurrentOrderIndex(0);

    console.log(`Заказ ${orderId} отменён курьером.`);
  };

  const handleNextOrder = () => {
    if (currentOrderIndex < acceptedOrders.length - 1) {
      setCurrentOrderIndex(currentOrderIndex + 1);
    }
  };

  const handlePreviousOrder = () => {
    if (currentOrderIndex > 0) {
      setCurrentOrderIndex(currentOrderIndex - 1);
    }
  };

  const currentOrder =
    acceptedOrders.length > 0 ? acceptedOrders[currentOrderIndex] : null;

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
        ) : orders.length === 0 ? (
          <p>Нет заказов со статусом "назначен курьер" для текущего курьера.</p>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <h3>Заказ #{order.id}</h3>
                  <p>
                    {order.orderItems.map((item) => `${item.menuItem.name} x ${item.quantity}`).join(", ")}
                  </p>
                  <p>Общий вес: {order.orderItems.reduce((acc, item) => acc + item.menuItem.weight * item.quantity, 0)} г</p>
                  <p>Сумма: {order.totalPrice.toFixed(2)} ₽</p>
                  <p>Время заказа: {order.orderTime ? new Date(order.orderTime).toLocaleTimeString() : "Не указано"}</p>
                  <p>Адрес доставки: {order.deliveryAddress}</p>
                  <div className="buttons">
                    <button
                      className="accept-button"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      Принять
                    </button>
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

            <div className="current-order">
              {currentOrder ? (
                <>
                  <h3>Текущий заказ {currentOrder.id}</h3>
                  <p>
                    {currentOrder.orderItems.map(
                      (item) => `${item.menuItem.name} x ${item.quantity}`
                    ).join(", ")}
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
                  <div className="buttons">
                    <button
                      className="accept-button"
                      onClick={() => handleCompleteOrder(currentOrder.id)}
                    >
                      Завершить
                    </button>
                    <button
                      className="reject-button"
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
          </>
        )}
      </div>
    </div>
  );
}

export default CourierPage;
