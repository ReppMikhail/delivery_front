import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  getAllCustomers,
  getAllManagers,
  getAllCouriers,
  createEmployee,
  updateUser,
  deleteUser,
} from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";

const ManagersPage = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    address: "",
    roles: ["ROLE_MANAGER"],
  });
  const [editMode, setEditMode] = useState(false);
  const [editManagerId, setEditManagerId] = useState(null);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const data = await getAllManagers();
      setManagers(data);
    } catch (error) {
      console.error("Ошибка загрузки менеджеров:", error);
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
      phone: "",
      address: "",
      roles: ["ROLE_MANAGER"],
    });
    setEditMode(false);
  };

  const handleEditClick = (manager) => {
    setShowForm(true);
    setFormData({
      ...manager,
      password: "",
    });
    setEditMode(true);
    setEditManagerId(manager.id);
  };

  const handleDeleteClick = async (id) => {
    try {
      const orders = await getAllOrders();
      const hasActiveOrders = orders.some(
        (order) => order.managerId === id && order.status !== "доставлен" && order.status !== "отменен"
      );

      if (hasActiveOrders) {
        alert("Невозможно удалить менеджера, так как имеются активные заказы.");
        return;
      }

      await deleteUser(id);
      loadManagers();
    } catch (error) {
      console.error("Ошибка удаления менеджера:", error);
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
          (!editMode || user.id !== editManagerId) // Исключаем текущего пользователя в режиме редактирования
      );
  
      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        return;
      }
  
      if (editMode) {
        // Обновление менеджера
        const updatedData = {
          name: formData.name,
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
        };
        await updateUser(editManagerId, updatedData);
      } else {
        // Добавление нового менеджера
        const newManagerData = {
          ...formData,
          passwordConfirmation: formData.password, // Устанавливаем пароль дважды
        };
        await createEmployee(newManagerData);
      }
  
      setShowForm(false);
      loadManagers();
    } catch (error) {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="admin-page">
      <NavigationBar />
      <div className="admin-content">
        <div>
          <h2>Список менеджеров</h2>
          <button onClick={handleAddClick} className="admin-add-item-button">
            Добавить менеджера
          </button>
          <ul className="admin-list">
            {managers.map((manager) => (
              <li key={manager.id} className="admin-item">
                <div>
                  <div className="action-buttons">
                    <button onClick={() => handleEditClick(manager)}>✏️</button>
                    <button onClick={() => handleDeleteClick(manager.id)}>
                      ❌
                    </button>
                  </div>
                  <p>ID: {manager.id}</p>
                  <strong>{manager.name}</strong>
                  <p>Логин: {manager.username}</p>
                  <p>Телефон: {manager.phone}</p>
                  <p>Адрес: {manager.address}</p>
                  <p>Роли: {manager.roles.join(", ")}</p>
                </div>
              </li>
            ))}
          </ul>

          {showForm && (
            <div className="admin-form">
              <h3>{editMode ? "Редактировать менеджера" : "Добавить менеджера"}</h3>
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
                  placeholder="Введите ФИО менеджера"
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
                  placeholder="Введите логин менеджера"
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
                      placeholder="Введите пароль менеджера"
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
                  placeholder="Введите телефон менеджера"
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
                  placeholder="Введите адрес менеджера"
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

export default ManagersPage;
