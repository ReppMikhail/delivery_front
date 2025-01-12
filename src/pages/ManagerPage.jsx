import React, { useState, useEffect } from "react";
import {
  getAllOrders,
  markOrderPrepared,
  getCouriersOnShift,
  assignCourierToOrder,
  startCourierDelivery,
  cancelOrder,
} from "../http/orderService";
import "./ManagerPage.css";

function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [assigningOrderId, setAssigningOrderId] = useState(null); // ID заказа для назначения курьера

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

  // Загрузка курьеров
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const couriersData = await getCouriersOnShift();
        setCouriers(couriersData);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке курьеров");
      }
    };

    fetchCouriers();
  }, []);

  // Получение активных заказов для курьеров
  const getCourierOrders = (courierId) => {
    return orders
      .filter(
        (order) =>
          order.status === "в пути" || order.status === "назначен курьер"
      )
      .filter((order) => order.courierId === courierId);
  };

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

  // Обработка назначения курьера
  const handleAssignCourier = async (orderId, courierId) => {
    try {
      await assignCourierToOrder(orderId, courierId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "назначен курьер", courierId }
            : order
        )
      );
      setAssigningOrderId(null);
      alert(`Курьер ${courierId} назначен на заказ ${orderId}`);
    } catch (err) {
      alert(err.message || "Ошибка при назначении курьера");
    }
  };

  const handleStartDelivery = async (courierId) => {
    try {
      await startCourierDelivery(courierId);
  
      setCouriers((prevCouriers) =>
        prevCouriers.map((courier) =>
          courier.userId === courierId ? { ...courier, onDelivery: true } : courier
        )
      );
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.courierId === courierId && order.status === "назначен курьер"
            ? { ...order, status: "в пути" }
            : order
        )
      );
  
      alert(`Курьер ${courierId} начал доставку.`);
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
                    // order.status === "Не назначен"
                    //   ? "pending"
                    //   : 
                      order.status === "готовится"
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
                      {item.menuItem.name} x {item.quantity} ({item.priceAtOrderTime}₽)
                    </li>
                  ))}
                </ul>
                <div className="order-footer">
                  <span>Итого: {order.totalPrice}₽</span>
                  <span>Адрес: {order.deliveryAddress}</span>
                  <span>Время оформления: {order.createdAt || "Не указано"}</span>
                </div>
              </div>
              <div className="order-actions">
                {order.status === "в обработке" && (
                  <div>
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
                    <button
                      className="cancel-assign"
                      onClick={() => setAssigningOrderId(null)}
                    >
                      Отменить назначение
                    </button>
                  ) : (
                    <button
                      className="assign"
                      onClick={() => setAssigningOrderId(order.id)}
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

      <div className="couriers-section">
        <h2>Курьеры на смене</h2>
        {couriers.length === 0 ? (
          <p>Нет курьеров на смене</p>
        ) : (
          couriers.map((courier) => (
            <div key={courier.userId} className="courier-card">
              <div className="courier-header">
                <span>ID: {courier.userId}</span>
                <span
                  className={`status ${courier.onDelivery ? "busy" : "free"}`}
                >
                  {courier.onDelivery ? "На доставке" : "Свободен"}
                </span>
              </div>
              <div className="courier-details">
                <p>Имя: {courier.name}</p>
                <p>Телефон: {courier.phone}</p>
                {getCourierOrders(courier.userId).length > 0 && (
                  <p>Заказы: {getCourierOrders(courier.userId).map(o => o.id).join(", ")}</p>
                )}
              </div>
              {!courier.onDelivery && assigningOrderId && (
                <button
                  className="assign-to-courier"
                  onClick={() => handleAssignCourier(assigningOrderId, courier.userId)}
                >
                  Назначить
                </button>
              )}
              {!courier.onDelivery && getCourierOrders(courier.userId).length > 0 && (
                <button
                  className="start-delivery"
                  onClick={() => handleStartDelivery(courier.userId)}
                >
                  Начать доставку
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManagerPage;
