import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCouriersOnShift,
  getAllCouriers,
  createEmployee,
  updateUser,
  deleteUser,
} from "../../http/adminService";
import "./Admin.css";

const CouriersPage = () => {
  const navigate = useNavigate();
  const [couriers, setCouriers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirmation: "",
    phone: "",
    address: "",
    roles: ["ROLE_COURIER"],
  });
  const [editMode, setEditMode] = useState(false);
  const [editCourierId, setEditCourierId] = useState(null);
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false);

  useEffect(() => {
    loadCouriers();
  }, []);

  const loadCouriers = async () => {
    try {
      const data = await getAllCouriers();
      setCouriers(data);
    } catch (error) {
      console.error("Ошибка загрузки курьеров:", error);
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
      roles: ["ROLE_COURIER"],
    });
    setEditMode(false);
  };

  const handleEditClick = (courier) => {
    setShowForm(true);
    setFormData({
      ...courier,
      password: "",
      passwordConfirmation: "",
    });
    setEditMode(true);
    setEditCourierId(courier.id);
  };

  const handleDeleteClick = async (id) => {
    try {
      // Получаем список курьеров на смене
      const couriersOnShift = await getCouriersOnShift();
  
      // Проверяем, находится ли курьер на смене
      const isOnShift = couriersOnShift.some(courier => courier.userId === id && courier.onShift);
  
      if (isOnShift) {
        alert("Нельзя удалить курьера, который находится на смене.");
        return;
      }
  
      // Если курьер не на смене, выполняем удаление
      await deleteUser(id);
      loadCouriers();
    } catch (error) {
      console.error("Ошибка удаления курьера:", error);
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
        await updateUser(editCourierId, updatedData);
      } else {
        await createEmployee(formData);
      }

      setShowForm(false);
      loadCouriers();
    } catch (error) {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="admin-page">
      <header className="navbar">
        <button onClick={() => navigate("/admin")}>Блюда</button>
        <button onClick={() => navigate("/clients")}>Клиенты</button>
        <button onClick={() => navigate("/managers")}>Менеджеры</button>
        <button onClick={() => navigate("/couriers")}>Курьеры</button>
        <button onClick={() => navigate("/orders")}>Заказы</button>
        <button onClick={() => navigate("/directory")}>Справочник</button>
          {/* Выпадающее меню "О нас" */}
        <button
          onClick={() => setAboutDropdownVisible(!aboutDropdownVisible)}
        >
          О нас
        </button>
        {aboutDropdownVisible && (
          <div className="dropdown-popup">
            <button onClick={() => navigate("/about/system")}>
              О системе
            </button>
            <button onClick={() => navigate("/about/developers")}>
              О разработчиках
            </button>
          </div>
        )}
        <button onClick={() => {
          localStorage.clear(); // Очищает local storage
          navigate("/"); // Перенаправляет на главную страницу
          }}>Выйти
        </button>
      </header>
      <h2>Список курьеров</h2>
      <button onClick={handleAddClick}>Добавить курьера</button>

      <ul className="courier-list">
        {couriers.map((courier) => (
          <li key={courier.id} className="courier-item">
            <div>
              <p>ID: {courier.id}</p>
              <strong>{courier.name}</strong>
              <p>Логин: {courier.username}</p>
              <p>Телефон: {courier.phone}</p>
              <p>Адрес: {courier.address}</p>
              <p>Роли: {courier.roles.join(", ")}</p>
            </div>
            <div>
              <button onClick={() => handleEditClick(courier)}>✏️</button>
              <button onClick={() => handleDeleteClick(courier.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="courier-form">
          <h3>{editMode ? "Редактировать курьера" : "Добавить курьера"}</h3>
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

export default CouriersPage;
