import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, getUserById } from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [couriers, setCouriers] = useState({});
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);

      const uniqueCustomerIds = [...new Set(data.map((order) => order.customerId))];
      const uniqueCourierIds = [
        ...new Set(data.map((order) => order.courierId).filter((id) => id !== null)),
      ];

      const customerPromises = uniqueCustomerIds.map((id) => getUserById(id));
      const courierPromises = uniqueCourierIds.map((id) => getUserById(id));

      const [customerData, courierData] = await Promise.all([
        Promise.all(customerPromises),
        Promise.all(courierPromises),
      ]);

      const customersMap = {};
      customerData.forEach((customer) => {
        customersMap[customer.id] = customer;
      });

      const couriersMap = {};
      courierData.forEach((courier) => {
        couriersMap[courier.id] = courier;
      });

      setCustomers(customersMap);
      setCouriers(couriersMap);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
    }
  };

  const renderOrderItems = (orderItems) =>
    orderItems.map((item) => (
      <div key={item.id} className="order-item">
        <p>Блюдо: {item.menuItem.name}</p>
        <p>Цена: {item.priceAtOrderTime} ₽</p>
        <p>Количество: {item.quantity}</p>
      </div>
    ));

  const renderUserDetails = (userId, userType) => {
    const user = userType === "customer" ? customers[userId] : couriers[userId];

    if (!user) return <p>Информация отсутствует</p>;

    return (
      <div className="user-details">
        <p>Роль: {user.roles.includes("ROLE_CUSTOMER") ? "Клиент" : "Курьер"}</p>
        <p>ID: {user.id}</p>
        <p>Имя: {user.name}</p>
        <p>Телефон: {user.phone}</p>
        <p>Адрес: {user.address}</p>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <NavigationBar></NavigationBar>
      <h2>Список заказов</h2>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <h3>Заказ #{order.id}</h3>
            <p>Статус: {order.status}</p>
            <p>Общая сумма: {order.totalPrice} ₽</p>
            <p>Время оформления: {order.createdAt}</p>
            <p>Время доставки: {order.deliveryTime || "Не указано"}</p>
            <p>Адрес доставки: {order.deliveryAddress}</p>
            <p>Комментарий: {order.comment || "Нет комментария"}</p>
            <p>Метод оплаты: {order.paymentMethod}</p>
            <p>Статус оплаты: {order.paymentStatus}</p>
            <h4>Блюда в заказе:</h4>
            {renderOrderItems(order.orderItems)}
            <h4>Данные клиента:</h4>
            {renderUserDetails(order.customerId, "customer")}
            <h4>Данные курьера:</h4>
            {order.courierId
              ? renderUserDetails(order.courierId, "courier")
              : "Курьер не назначен"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
