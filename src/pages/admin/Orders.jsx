import React, { useState, useEffect } from "react";
import { getAllOrders, getUserById } from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [couriers, setCouriers] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

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

  

  return (
    <div className="admin-page">
      <NavigationBar />
      <div className="admin-content">
        <h2>Список заказов</h2>
        <ul className="admin-list">
          {orders.map((order) => (
            <li key={order.id} className="admin-item">
              <div>
                <h3>Заказ #{order.id}</h3>
                <p><strong>Статус:</strong> {order.status}</p>
                <p><strong>Общая сумма:</strong> {order.totalPrice} ₽</p>
                <p><strong>Время оформления:</strong> {order.createdAt}</p>
                <p><strong>Время доставки:</strong> {order.deliveryTime || "Не указано"}</p>
                <p><strong>Адрес доставки:</strong> {order.deliveryAddress}</p>
                <p><strong>Комментарий:</strong> {order.comment || "Нет комментария"}</p>
                <p><strong>Метод оплаты:</strong> {order.paymentMethod}</p>
                <p><strong>Статус оплаты:</strong> {order.paymentStatus}</p>

                <h4>Блюда в заказе:</h4>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.id}>
                      <p>Блюдо: {item.menuItem.name}</p>
                      <p>Цена: {item.priceAtOrderTime} ₽</p>
                      <p>Количество: {item.quantity}</p>
                    </li>
                  ))}
                </ul>

                <h4>Данные клиента:</h4>
                {customers[order.customerId] ? (
                  <div>
{renderUserDetails(order.customerId, "customer")}
                  </div>
                ) : (
                  <p>Информация о клиенте недоступна</p>
                )}

                <h4>Данные курьера:</h4>
                {order.courierId && couriers[order.courierId] ? (
                  <div>
{renderUserDetails(order.courierId, "courier")}
                  </div>
                ) : (
                  <p>Курьер не назначен</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersPage;
