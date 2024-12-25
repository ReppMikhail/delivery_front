import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerPage.css"; // Отдельный CSS файл для стилей

const ordersData = [
  {
    id: 1,
    name: "Заказ 1",
    items: ["Том ям x 2", "Сет на двоих x 1"],
    positions: 3,
    weight: "1043 г",
    time: "16:30",
    status: "Не назначен",
  },
  {
    id: 2,
    name: "Заказ 2",
    items: ["Том ям x 2", "Сет на двоих x 1"],
    positions: 3,
    weight: "1043 г",
    time: "16:30",
    status: "На доставке",
  },
];

const couriersData = [
  {
    id: 1,
    name: "Садовников Кирилл Александрович",
    phone: "89874515280",
    status: "Свободен",
  },
  {
    id: 2,
    name: "Постнов Алексей Александрович",
    phone: "89874515280",
    status: "Заказ 2",
  },
];

function ManagerPage() {
  const [orders, setOrders] = useState(ordersData);
  const [couriers, setCouriers] = useState(couriersData);

  const handleAcceptOrder = (orderId) => {
    const courierId = prompt("Введите ID курьера для назначения:");
    const selectedCourier = couriers.find((c) => c.id === parseInt(courierId));

    if (selectedCourier && selectedCourier.status === "Свободен") {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: `Курьер: ${selectedCourier.name}` } : order
        )
      );
      setCouriers((prevCouriers) =>
        prevCouriers.map((courier) =>
          courier.id === selectedCourier.id ? { ...courier, status: `Заказ ${orderId}` } : courier
        )
      );
      alert(`Курьер ${selectedCourier.name} назначен на заказ ${orderId}`);
    } else {
      alert("Курьер недоступен или ID указан неверно.");
    }
  };

  const handleRejectOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    alert(`Заказ ${orderId} отклонён.`);
  };

  return (
    <div className="manager-container">
      <div className="orders-section">
        <h2>Заказы</h2>
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>{order.name}</span>
              <span className={`status ${order.status === "Не назначен" ? "pending" : "assigned"}`}>
                {order.status}
              </span>
            </div>
            <div className="order-details">
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div className="order-footer">
                <span>{order.positions} позиций</span>
                <span>{order.weight}</span>
                <span>{order.time}</span>
              </div>
            </div>
            <div className="order-actions">
              <button className="accept" onClick={() => handleAcceptOrder(order.id)}>
                Принять
              </button>
              <button className="reject" onClick={() => handleRejectOrder(order.id)}>
                Отклонить
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="couriers-section">
        <h2>Курьеры</h2>
        {couriers.map((courier) => (
          <div key={courier.id} className="courier-card">
            <span>{courier.name}</span>
            <span>{courier.phone}</span>
            <span className={`status ${courier.status === "Свободен" ? "free" : "busy"}`}>
              {courier.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerPage;