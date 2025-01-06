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
  const [isOnDelivery, setIsOnDelivery] = useState(false);

  useEffect(() => {
    const fetchOrdersAndDeliveryStatus = async () => {
      try {
        setLoading(true);

        const authData = JSON.parse(localStorage.getItem("authData"));
        const courierId = authData?.id;
        if (!courierId) throw new Error("Courier ID not found in localStorage");

        // Получение заказов
        const fetchedOrders = await getOrdersByCustomerId(4); // Замените на нужный customerId, если нужно
        const filteredPendingOrders = fetchedOrders.filter(
          (order) => order.status === "назначен курьер"
        );
        const filteredInProgressOrders = fetchedOrders.filter(
          (order) => order.status === "в пути"
        );

        setPendingOrders(filteredPendingOrders);
        setInProgressOrders(filteredInProgressOrders);

        // Проверка статуса доставки
        const [couriersOnShiftResponse, couriersNotOnDeliveryResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/v1/couriers/all-on-shift"),
            axios.get(
              "http://localhost:8080/api/v1/couriers/all-on-shift-and-not-on-delivery"
            ),
          ]);

        const couriersOnShift = couriersOnShiftResponse.data || [];
        const couriersNotOnDelivery = couriersNotOnDeliveryResponse.data || [];

        const isCurrentlyOnDelivery =
          couriersOnShift.some((courier) => courier.id === courierId) &&
          !couriersNotOnDelivery.some((courier) => courier.id === courierId);

        setIsOnDelivery(isCurrentlyOnDelivery);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndDeliveryStatus();
  }, []);

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
      setIsOnDelivery(false); // Обновляем статус
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
        ) : pendingOrders.length > 0 ? (
          <div>
            <h2>Назначенные курьеру заказы</h2>
            <div className="orders-list">
              {pendingOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <h3>Заказ #{order.id}</h3>
                  <p>
                    {order.orderItems
                      .map((item) => `${item.menuItem.name} x ${item.quantity}`)
                      .join(", ")}
                  </p>
                  <p>
                    Общий вес:{" "}
                    {order.orderItems.reduce(
                      (acc, item) => acc + item.menuItem.weight * item.quantity,
                      0
                    )}{" "}
                    г
                  </p>
                  <p>Сумма: {order.totalPrice.toFixed(2)} ₽</p>
                  <p>Адрес доставки: {order.deliveryAddress}</p>
                  <button
                    className="reject-button"
                    onClick={() => handleRejectOrder(order.id)}
                  >
                    Отклонить
                  </button>
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
                  <p>
                    {order.orderItems
                      .map((item) => `${item.menuItem.name} x ${item.quantity}`)
                      .join(", ")}
                  </p>
                  <p>Сумма: {order.totalPrice.toFixed(2)} ₽</p>
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
              ))}
            </div>
          </div>
        ) : isOnDelivery ? (
          <div>
            <p>Нет доступных заказов.</p>
            <button className="end-delivery-button" onClick={handleEndDelivery}>
              Завершить доставку
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
