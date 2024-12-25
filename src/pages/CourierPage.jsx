import React, { useState } from "react";

function CourierPage() {
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

    // Уведомление менеджера
    console.log(`Заказ ${orderId} принят курьером.`);
  };

  const handleRejectOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);

    // Уведомление менеджера
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

    // Уведомление менеджера
    console.log(`Заказ ${orderId} завершён.`);
  };

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    setAcceptedOrders(
      acceptedOrders.filter((order) => order.id !== orderId)
    );
    setCurrentOrderIndex(0);

    // Уведомление менеджера
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
    <div style={styles.container}>
      <div style={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <h3>{order.title}</h3>
            <p>{order.items.join(", ")}</p>
            <p>{order.totalWeight} • {order.time}</p>
            <p>{order.address}</p>
            <div style={styles.buttons}>
              <button
                style={styles.acceptButton}
                onClick={() => handleAcceptOrder(order.id)}
              >
                Принять
              </button>
              <button
                style={styles.rejectButton}
                onClick={() => handleRejectOrder(order.id)}
              >
                Отклонить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.currentOrder}>
        {currentOrder ? (
          <>
            <h3>Текущий заказ {currentOrder.id}</h3>
            <p>{currentOrder.items.join(", ")}</p>
            <p>Комментарий к заказу:</p>
            <textarea style={styles.textarea} placeholder="Комментарий..." />
            <p>{currentOrder.totalWeight} • {currentOrder.time}</p>
            <p>{currentOrder.address}</p>
            <div style={styles.arrowButtons}>
              <button onClick={handlePreviousOrder}>&uarr;</button>
              <button onClick={handleNextOrder}>&darr;</button>
            </div>
            <div style={styles.buttons}>
              <button
                style={styles.acceptButton}
                onClick={() => handleCompleteOrder(currentOrder.id)}
              >
                Завершить
              </button>
              <button
                style={styles.rejectButton}
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
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  ordersList: {
    flex: 1,
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    overflowY: "auto",
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  acceptButton: {
    backgroundColor: "#00c853",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectButton: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  currentOrder: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  textarea: {
    width: "100%",
    height: "80px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "15px",
  },
  arrowButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
};

export default CourierPage;
