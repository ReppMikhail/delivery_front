import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByCustomerId } from "../http/orderService";
import axios from "axios";
import "./Courier.css";

function CourierPage() {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courierStatus, setCourierStatus] = useState({
    onShift: false,
    onDelivery: false,
  });

  useEffect(() => {
    const fetchOrdersAndDeliveryStatus = async () => {
      try {
        setLoading(true);

        const authData = JSON.parse(localStorage.getItem("authData"));
        const courierId = authData?.id;
        if (!courierId) throw new Error("Courier ID not found in localStorage");

        // Получение статуса курьера
        const courierStatusResponse = await axios.get(
          `http://localhost:8080/api/v1/couriers/${courierId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );
        setCourierStatus(courierStatusResponse.data);

        // Получение всех заказов
      const ordersResponse = await axios.get(
        `http://localhost:8080/api/v1/orders`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );

      const fetchedOrders = ordersResponse.data;
        const filteredPendingOrders = fetchedOrders.filter(
          (order) => order.status === "назначен курьер"  && courierId === order.courierId
        );
        const filteredInProgressOrders = fetchedOrders.filter(
          (order) => order.status === "в пути"  && courierId === order.courierId
        );

        setPendingOrders(filteredPendingOrders);
        setInProgressOrders(filteredInProgressOrders);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndDeliveryStatus();
  }, []);

  const handleStartShift = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const courierId = authData?.id;
      const token = authData?.accessToken;
      if (!courierId || !token)
        throw new Error("Токен авторизации отсутствует");

      await axios.put(
        `http://localhost:8080/api/v1/couriers/${courierId}/start-shift`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Курьер начал смену.");
      setCourierStatus((prev) => ({ ...prev, onShift: true }));
    } catch (error) {
      console.error("Ошибка начала смены:", error.message);
    }
  };

  const handleEndShift = async () => {
    try {
      if (courierStatus.onDelivery) {
        alert("Нельзя закончить смену, пока вы находитесь в доставке.");
        return;
      }
  
      if (pendingOrders.length > 0 || inProgressOrders.length > 0) {
        alert("Нельзя закончить смену, пока есть незавершённые заказы.");
        return;
      }
  
      const authData = JSON.parse(localStorage.getItem("authData"));
      const courierId = authData?.id;
      const token = authData?.accessToken;
      if (!courierId || !token)
        throw new Error("Токен авторизации отсутствует");
  
      await axios.put(
        `http://localhost:8080/api/v1/couriers/${courierId}/end-shift`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Курьер завершил смену.");
      setCourierStatus((prev) => ({ ...prev, onShift: false }));
    } catch (error) {
      console.error("Ошибка завершения смены:", error.message);
    }
  };
  

  const handleEndDelivery = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const courierId = authData?.id;
      const token = authData?.accessToken;
      if (!courierId || !token)
        throw new Error("Токен авторизации отсутствует");

      await axios.put(
        `http://localhost:8080/api/v1/couriers/${courierId}/end-delivery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Курьер завершил доставку.");
      setCourierStatus((prev) => ({ ...prev, onDelivery: false }));
    } catch (error) {
      console.error("Ошибка завершения доставки:", error.message);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const token = authData?.accessToken;
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
      console.log(
        `Заказ ${orderId} отклонён и переведён в статус "готовится".`
      );
    } catch (error) {
      console.error(`Ошибка при обновлении заказа ${orderId}:`, error.message);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const courierId = authData?.id;
      const token = authData?.accessToken;
      if (!token) throw new Error("Токен авторизации отсутствует");

      await axios.put(
        `http://localhost:8080/api/v1/couriers/${courierId}/end-order`,
        { id: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInProgressOrders(
        inProgressOrders.filter((order) => order.id !== orderId)
      );
      console.log(
        `Заказ ${orderId} завершён и переведён в статус "Доставлен".`
      );
    } catch (error) {
      console.error(`Ошибка при завершении заказа ${orderId}:`, error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const token = authData?.accessToken;
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

      setInProgressOrders(
        inProgressOrders.filter((order) => order.id !== orderId)
      );
      console.log(`Заказ ${orderId} отменён и переведён в статус "готовится".`);
    } catch (error) {
      console.error(`Ошибка при отмене заказа ${orderId}:`, error.message);
    }
  };

  const formatOrderTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="courier-page">
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/about")}>О нас</button>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/courier")}>Заказы</button>
          {courierStatus.onShift && (
            <button className="end-shift-button" onClick={handleEndShift}>
              Закончить смену
            </button>
          )}
        </div>
      </header>

      <div className="content">
        {loading ? (
          <p>Загрузка заказов...</p>
        ) : pendingOrders.length > 0 ? (
          <div>
            <h2>Назначенные курьеру заказы</h2>
            <div className="orders-list">
              {pendingOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <h3>Заказ #{order.id}</h3>
                  {/* Основное содержимое */}
                  <div className="order-card-content">
                    <p>
                      {order.orderItems.map((item) => (
                        <div key={item.menuItem.id} className="order-items">
                          {item.menuItem.name} x {item.quantity}
                          <br />
                        </div>
                      ))}
                    </p>
                  </div>

                  {/* Футер карточки */}
                  <div className="order-card-footer">
                    <hr className="divider-line" />
                    <div className="order-details-row">
                      <p>{order.totalPrice.toFixed(2)} ₽</p>
                      <p>{formatOrderTime(order.orderTime)}</p>
                      <p>
                        {order.orderItems.reduce(
                          (acc, item) =>
                            acc + item.menuItem.weight * item.quantity,
                          0
                        )}
                        г
                      </p>
                    </div>

                    <p>Адрес доставки: {order.deliveryAddress}</p>
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
          </div>
        ) : inProgressOrders.length > 0 ? (
          <div>
            <h2>Заказы в пути</h2>
            <div className="orders-list">
              {inProgressOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <h3>Заказ #{order.id}</h3>

                  {/* Основное содержимое */}
                  <div className="order-card-content">
                    <p>
                      {order.orderItems.map((item) => (
                        <div key={item.menuItem.id} className="order-items">
                          {item.menuItem.name} x {item.quantity}
                          <br />
                        </div>
                      ))}
                    </p>
                  </div>

                  {/* Футер карточки */}
                  <div className="order-card-footer">
                    <hr className="divider-line" />
                    <div className="order-details-row">
                      <p>{order.totalPrice.toFixed(2)} ₽</p>
                      <p>{formatOrderTime(order.orderTime)}</p>
                      <p>
                        {order.orderItems.reduce(
                          (acc, item) =>
                            acc + item.menuItem.weight * item.quantity,
                          0
                        )}
                        г
                      </p>
                    </div>

                    <p>Адрес доставки: {order.deliveryAddress}</p>
                    <div className="buttons">
                      <button
                        className="complete-button"
                        onClick={() => handleCompleteOrder(order.id)}
                      >
                        Завершить
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Отменить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : courierStatus.onShift && courierStatus.onDelivery ? (
          <div>
            <p>Нет доступных заказов.</p>
            <button className="end-delivery-button" onClick={handleEndDelivery}>
              Завершить доставку
            </button>
          </div>
          ) : !courierStatus.onShift ? (
            <div>
              <p>Вы не на смене.</p>
              <button className="start-shift-button" onClick={handleStartShift}>
                Начать смену
              </button>
            </div>
        ) : (
          <p>Нет доступных заказов.</p>
        )}
      </div>
    </div>
  );
}

export default CourierPage;
