import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  getAllCustomers,
  getAllManagers,
  getAllCouriers,
  createCustomer,
  updateUser,
  deleteUser,
} from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";

const ClientsPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirmation: "",
    phone: "",
    address: "",
    roles: ["ROLE_CUSTOMER"],
  });
  const [editMode, setEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getAllCustomers();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClick = () => {
    setShowForm(true);
    setFormData({
      name: "",
      username: "",
      password: "",
      passwordConfirmation: "",
      phone: "",
      address: "",
      roles: ["ROLE_CUSTOMER"],
    });
    setEditMode(false);
  };

  const handleEditClick = (client) => {
    setShowForm(true);
    setFormData({
      ...client,
      password: "",
      passwordConfirmation: "",
    });
    setEditMode(true);
    setEditClientId(client.id);
  };

  const handleDeleteClick = async (id) => {
    try {
      const orders = await getAllOrders();
      const hasActiveOrders = orders.some(
        (order) =>
          order.customerId === id &&
          order.status !== "доставлен" &&
          order.status !== "отменен"
      );

      if (hasActiveOrders) {
        alert("Невозможно удалить клиента, так как имеются активные заказы.");
        return;
      }

      await deleteUser(id);
      loadClients();
    } catch (error) {
      console.error("Ошибка удаления клиента:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Загружаем всех пользователей (клиенты, менеджеры, курьеры)
      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);
  
      const allUsers = [...customers, ...managers, ...couriers];
  
      // Проверяем уникальность логина
      const isUsernameTaken = allUsers.some(
        (user) =>
          user.username === formData.username &&
          (!editMode || user.id !== editClientId) // Исключаем текущего пользователя в режиме редактирования
      );
  
      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        return;
      }
  
      if (editMode) {
        // Обновление клиента
        const updatedData = {
          name: formData.name,
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
        };
        await updateUser(editClientId, updatedData);
      } else {
        // Добавление нового клиента
        const newClientData = {
          ...formData,
          passwordConfirmation: formData.password, // Устанавливаем пароль дважды
        };
        await createCustomer(newClientData);
      }
  
      setShowForm(false);
      loadClients();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="admin-page">
      <NavigationBar />
      <div className="admin-content">
        <div>
          <h2>Список клиентов</h2>
          <button onClick={handleAddClick} className="admin-add-item-button">
            Добавить клиента
          </button>
          <ul className="admin-list">
            {clients.map((client) => (
              <li key={client.id} className="admin-item">
                <div>
                  <div className="action-buttons">
                    <button onClick={() => handleEditClick(client)}>✏️</button>
                    <button onClick={() => handleDeleteClick(client.id)}>
                      ❌
                    </button>
                  </div>
                  <p>ID: {client.id}</p>
                  <strong>{client.name}</strong>
                  <p>Логин: {client.username}</p>
                  <p>Телефон: {client.phone}</p>
                  <p>Адрес: {client.address}</p>
                  <p>Роли: {client.roles.join(", ")}</p>
                </div>
              </li>
            ))}
          </ul>

          {showForm && (
            <div className="admin-form">
              <h3>{editMode ? "Редактировать клиента" : "Добавить клиента"}</h3>
              <div className="form-group">
                <label htmlFor="name" className="admin-form-label">
                  ФИО:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="admin-form-input"
                  placeholder="Введите ФИО клиента"
                />
              </div>
              <div className="form-group">
                <label htmlFor="username" className="admin-form-label">
                  Логин:
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="admin-form-input"
                  placeholder="Введите логин клиента"
                />
              </div>
              {!editMode && (
                <>
                  <div className="form-group">
                    <label htmlFor="password" className="admin-form-label">
                      Пароль:
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="admin-form-input"
                      placeholder="Введите пароль клиента"
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="phone" className="admin-form-label">
                  Телефон:
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="admin-form-input"
                  placeholder="Введите телефон клиента"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address" className="admin-form-label">
                  Адрес:
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="admin-form-input"
                  placeholder="Введите адрес клиента"
                />
              </div>
              <div className="form-buttons">
                <button onClick={handleFormSubmit} className="admin-save-button">
                  ✔️ Сохранить
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="admin-cancel-button"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
