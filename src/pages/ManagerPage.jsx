import React, { useState, useEffect } from "react";
import {
  getAllOrders,
  markOrderPrepared,
  getCouriersOnShift,
  assignCourierToOrder,
  getCouriersOnShiftAndNotOnDelivery,
  startCourierDelivery,
  cancelOrder,
} from "../http/orderService";
import "./ManagerPage.css";

function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [assigningOrderId, setAssigningOrderId] = useState(null); // ID заказа для назначения курьера
  const [selectedCourier, setSelectedCourier] = useState(null); // Выбранный курьер для всплывающего окна

  // Загрузка заказов
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке заказов");
      }
    };

    fetchOrders();
  }, []);

  // Обработка принятия заказа
  const handleAcceptOrder = async (orderId) => {
    try {
      await markOrderPrepared(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "готовится" } : order
        )
      );
      alert(`Заказ ${orderId} помечен как \"готовится\"`);
    } catch (err) {
      alert(err.message || "Ошибка при обновлении заказа");
    }
  };

  // Обработка отмены заказа
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "отменен" } : order
        )
      );
      alert(`Заказ ${orderId} отменен`);
    } catch (err) {
      alert(err.message || "Ошибка при отмене заказа");
    }
  };

  // Загрузка свободных курьеров
  const loadAvailableCouriers = async () => {
    try {
      const data = await getCouriersOnShiftAndNotOnDelivery();
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
          order.id === orderId
            ? { ...order, status: "назначен курьер", courierName: couriers.find(courier => courier.id === courierId)?.name }
            : order
        )
      );
      setAssigningOrderId(null); // Закрыть всплывающее окно
      alert(`Курьер ${courierId} назначен на заказ ${orderId}`);
    } catch (err) {
      alert(err.message || "Ошибка при назначении курьера");
    }
  };

  // Начало доставки
  const handleStartDelivery = async (courierId, orderId) => {
    try {
      await startCourierDelivery(courierId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "в пути" } : order
        )
      );
      alert(`Курьер ${courierId} начал доставку заказа ${orderId}`);
    } catch (err) {
      alert(err.message || "Ошибка при начале доставки");
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
                    order.status === "Не назначен"
                      ? "pending"
                      : order.status === "готовится"
                      ? "assigned"
                      : "busy"
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
                  <span>Время оформления: {order.orderTime || "Не указано"}</span>
                </div>
              </div>
              <div className="order-actions">
                {order.status === "в обработке" && (
                  <div >
                    <button
                    className="accept"
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    Принять
                  </button>
                  <button
                  className="reject"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Отменить
                </button>
                  </div>
                )}
                {order.status === "готовится" && (
                  assigningOrderId === order.id ? (
                    <div className="couriers-popup">
                      {couriers.map((courier) => (
                        <div
                          key={courier.id}
                          className="courier-option"
                          onClick={() => handleAssignCourier(order.id, courier.id)}
                        >
                          {courier.name}
                        </div>
                      ))}
                      <button
                        className="cancel-popup"
                        onClick={() => setAssigningOrderId(null)}
                      >
                        Закрыть
                      </button>
                    </div>
                  ) : (
                    <button
                      className="assign"
                      onClick={async () => {
                        setAssigningOrderId(order.id);
                        await loadAvailableCouriers();
                      }}
                    >
                      Назначить курьера
                    </button>
                  )
                )}
                {order.status === "назначен курьер" && (
                  <>
                    <span>Курьер: {order.courierName}</span>
                    <button
                      className="start-delivery"
                      onClick={() => handleStartDelivery(order.courierId, order.id)}
                    >
                      Начать доставку
                    </button>
                  </>
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
