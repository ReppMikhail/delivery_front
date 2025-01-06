import React, { useState, useEffect } from "react";
import {
  getOrdersByCustomerId,
  markOrderPrepared,
  getCouriersOnShift,
  assignCourierToOrder,
} from "../http/orderService";
import "./ManagerPage.css";

function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [assigningOrderId, setAssigningOrderId] = useState(null); // ID заказа, для которого назначаем курьера
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

  // Обработка принятия заказа
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

  // Загрузка доступных курьеров
  const loadCouriers = async () => {
    try {
      const data = await getCouriersOnShift();
      setCouriers(data);
    } catch (err) {
      alert(err.message || "Ошибка при загрузке списка курьеров");
    }
  };

  // Обработка назначения курьера
  const handleAssignCourier = async (orderId, courierId) => {
    try {
      await assignCourierToOrder(orderId, courierId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Назначен курьер" } : order
        )
      );
      setAssigningOrderId(null); // Скрыть выпадающий список
      alert(`Курьер ${courierId} назначен на заказ ${orderId}`);
    } catch (err) {
      alert(err.message || "Ошибка при назначении курьера");
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
                {order.status === "в обработке" && (
                  <button
                    className="accept"
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    Принять
                  </button>
                )}
                {order.status === "готовится" && (
                  assigningOrderId === order.id ? (
                    <div>
                      <select
                        onChange={(e) =>
                          handleAssignCourier(order.id, e.target.value)
                        }
                      >
                        <option value="">Выберите курьера</option>
                        {couriers.map((courier) => (
                          <option key={courier.id} value={courier.id}>
                            {courier.name}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => setAssigningOrderId(null)}>
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button
                      className="assign"
                      onClick={async () => {
                        setAssigningOrderId(order.id);
                        await loadCouriers();
                      }}
                    >
                      Назначить курьера
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManagerPage;
