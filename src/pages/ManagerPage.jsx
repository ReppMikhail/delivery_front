import React, { useState, useEffect } from "react";
import { getOrdersByCustomerId, markOrderPrepared } from "../http/orderService";
import "./ManagerPage.css";

function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const userId = 4; // Замените на актуальный ID пользователя

  // Загрузка заказов
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByCustomerId(userId);
        setOrders(data);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке заказов");
      }
    };

    fetchOrders();
  }, [userId]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await markOrderPrepared(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "готовится" } : order
        )
      );
      alert(`Заказ ${orderId} помечен как "готовится"`);
    } catch (err) {
      alert(err.message || "Ошибка при обновлении заказа");
    }
  };

  return (
    <div className="manager-container">
      <div className="orders-section">
        <h2>Заказы</h2>
        {error && <p className="error">{error}</p>}
        {orders.length === 0 ? (
          <p>Нет заказов</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Заказ {order.id}</span>
                <span
                  className={`status ${
                    order.status === "Не назначен" ? "pending" : "assigned"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.id}>
                      {item.menuItem.name} x {item.quantity} (
                      {item.priceAtOrderTime}₽)
                    </li>
                  ))}
                </ul>
                <div className="order-footer">
                  <span>Итого: {order.totalPrice}₽</span>
                  <span>Адрес: {order.deliveryAddress}</span>
                  <span>Оплата: {order.paymentMethod}</span>
                  <span>Статус оплаты: {order.paymentStatus}</span>
                </div>
              </div>
              <div className="order-actions">
                <button
                  className="accept"
                  onClick={() => handleAcceptOrder(order.id)}
                >
                  Принять
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManagerPage;
