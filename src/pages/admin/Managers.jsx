import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  getAllManagers,
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
    passwordConfirmation: "",
    phone: "",
    address: "",
    roles: ["ROLE_MANAGER"],
  });
  const [editMode, setEditMode] = useState(false);
  const [editManagerId, setEditManagerId] = useState(null);
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false);

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
      passwordConfirmation: "",
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
      passwordConfirmation: "",
    });
    setEditMode(true);
    setEditManagerId(manager.id);
  };

  const handleDeleteClick = async (id) => {
    try {
      // Получить все заказы
      const orders = await getAllOrders();
  
      // Проверить заказы, относящиеся к менеджеру
      const hasActiveOrders = orders.some(
        (order) =>
          order.status !== "доставлен" &&
          order.status !== "отменен"
      );
  
      if (hasActiveOrders) {
        alert("Невозможно удалить менеджера, так как имеются активные заказы.");
        return;
      }
  
      // Удалить менеджера, если нет активных заказов
      await deleteUser(id);
      loadManagers();
    } catch (error) {
      console.error("Ошибка удаления менеджера:", error);
    }
  };
  

  const handleFormSubmit = async () => {
    try {
        if (editMode) {
          const updatedData = {
            name: formData.name,
            username: formData.username,
            phone: formData.phone,
            address: formData.address,
          };
          console.log("Edit Manager ID:", editManagerId);
          console.log("Updated Data:", updatedData);
          await updateUser(editManagerId, updatedData);
        } else {
          await createEmployee(formData);
        }
    
        setShowForm(false);
        loadManagers();
      } catch (error) {
        alert(`Ошибка: ${error.response?.data?.message || error.message}`);
      }
  };


  return (
    <div className="admin-page">
     <NavigationBar></NavigationBar>
      <h2>Список менеджеров</h2>
      <button onClick={handleAddClick}>Добавить менеджера</button>

      <ul className="manager-list">
        {managers.map((manager) => (
          <li key={manager.id} className="manager-item">
            <div>
              <p>ID: {manager.id}</p>
              <strong>{manager.name}</strong>
              <p>Логин: {manager.username}</p>
              <p>Телефон: {manager.phone}</p>
              <p>Адрес: {manager.address}</p>
              <p>Роли: {manager.roles.join(", ")}</p>
            </div>
            <div>
              <button onClick={() => handleEditClick(manager)}>✏️</button>
              <button onClick={() => handleDeleteClick(manager.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="manager-form">
          <h3>{editMode ? "Редактировать менеджера" : "Добавить менеджера"}</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="Имя"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFormChange}
            placeholder="Логин"
          />
          {!editMode && (
            <>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Пароль"
              />
              <input
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleFormChange}
                placeholder="Подтверждение пароля"
              />
            </>
          )}
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
            placeholder="Телефон"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            placeholder="Адрес"
          />
          <button onClick={handleFormSubmit}>✔️</button>
          <button onClick={() => setShowForm(false)}>Отмена</button>
        </div>
      )}
    </div>
  );
};

export default ManagersPage;
