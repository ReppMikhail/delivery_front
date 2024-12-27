import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Courier.css";

function CourierPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    {
      id: 1,
      title: "Новый заказ 1",
      items: ["Том ям x 2", "Сет на двоих x 1"],
      totalWeight: "1043 г",
      time: "16:30",
      address: "ул. Пушкина, д. 175, кв. 16",
      status: "Новый",
    },
    {
      id: 2,
      title: "Новый заказ 2",
      items: ["Том ям x 2", "Сет на двоих x 1"],
      totalWeight: "1043 г",
      time: "16:30",
      address: "ул. Пушкина, д. 175, кв. 16",
      status: "Новый",
    },
  ]);

  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

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
          {/* <button onClick={() => navigate("/main")}>Главная</button> */}
          <button onClick={() => navigate("/about")}>О нас</button>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          {/* <button onClick={() => navigate("/profile")}>Личный кабинет</button> */}
          <button onClick={() => navigate("/courier")}>Заказы</button>
        </div>
      </header>

      <div className="content">
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>{order.title}</h3>
              <p>{order.items.join(", ")}</p>
              <p>{order.totalWeight} • {order.time}</p>
              <p>{order.address}</p>
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
              <p>{currentOrder.items.join(", ")}</p>
              <textarea
                className="textarea"
                placeholder="Комментарий..."
              />
              <p>{currentOrder.totalWeight} • {currentOrder.time}</p>
              <p>{currentOrder.address}</p>
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
      </div>
    </div>
  );
}

export default CourierPage;
