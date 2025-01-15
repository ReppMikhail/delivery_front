import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCouriersOnShift,
  getAllCouriers,
  getAllCustomers,
  getAllManagers,
  createEmployee,
  updateUser,
  deleteUser,
} from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";
import ValidationHelper from "../../components/ValidationHelper";

const CouriersPage = () => {
  const navigate = useNavigate();
  const [couriers, setCouriers] = useState([]);
  const [couriersOnShift, setCouriersOnShift] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    address: "",
    roles: ["ROLE_COURIER"],
  });
  const [editMode, setEditMode] = useState(false);
  const [editCourierId, setEditCourierId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCouriers();
  }, []);

  const loadCouriers = async () => {
    try {
      const couriersData = await getAllCouriers();
      const couriersOnShiftData = await getCouriersOnShift();
      setCouriers(couriersData);
      setCouriersOnShift(couriersOnShiftData);
    } catch (error) {
      console.error("Ошибка загрузки курьеров:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update errors in real-time as user types
    const errors = { ...formErrors };
    switch (name) {
      case "name":
        errors.name = ValidationHelper.validateName(value);
        break;
      case "username":
        errors.username = ValidationHelper.validateEmail(value);
        break;
      case "password":
        if (!editMode) {
          errors.password = ValidationHelper.validatePassword(value);
        }
        break;
      case "phone":
        errors.phone = ValidationHelper.validatePhone(value);
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const handleAddClick = () => {
    setShowForm(true);
    setFormData({
      name: "",
      username: "",
      password: "",
      phone: "",
      address: "",
      roles: ["ROLE_COURIER"],
    });
    setEditMode(false);
    setFormErrors({});
  };

  const handleEditClick = (courier) => {
    setShowForm(true);
    setFormData({
      ...courier,
      password: "",
    });
    setEditMode(true);
    setEditCourierId(courier.id);
    setFormErrors({});
  };

  const handleDeleteClick = async (id) => {
    try {
      const courierShiftData = await getCouriersOnShift();
      const isOnShift = courierShiftData.some(
        (courier) => courier.userId === id && courier.onShift
      );

      if (isOnShift) {
        alert("Нельзя удалить курьера, который находится на смене.");
        return;
      }

      await deleteUser(id);
      loadCouriers();
    } catch (error) {
      console.error("Ошибка удаления курьера:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Validate form data before submitting
      const errors = {
        name: ValidationHelper.validateName(formData.name),
        username: ValidationHelper.validateEmail(formData.username),
        phone: ValidationHelper.validatePhone(formData.phone),
      };

      if (!editMode) {
        errors.password = ValidationHelper.validatePassword(formData.password);
      }

      const filteredErrors = Object.fromEntries(
        Object.entries(errors).filter(([, value]) => value)
      );

      if (Object.keys(filteredErrors).length > 0) {
        setFormErrors(filteredErrors);
        return;
      }

      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);
      const allUsers = [...customers, ...managers, ...couriers];

      const isUsernameTaken = allUsers.some(
        (user) =>
          user.username === formData.username &&
          (!editMode || user.id !== editCourierId)
      );

      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        return;
      }

      if (editMode) {
        const updatedData = {
          name: formData.name,
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
        };
        await updateUser(editCourierId, updatedData);
      } else {
        const newCourierData = {
          ...formData,
          passwordConfirmation: formData.password,
        };
        await createEmployee(newCourierData);
      }

      setShowForm(false);
      loadCouriers();
    } catch (error) {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="admin-page">
      <NavigationBar />
      <div className="admin-content">
        <div>
          <h2>Список курьеров</h2>
          <button onClick={handleAddClick} className="admin-add-item-button">
            Добавить курьера
          </button>
          <ul className="admin-list">
            {couriers.map((courier) => {
              const courierShiftData = couriersOnShift.find(
                (c) => c.userId === courier.id
              );
              return (
                <li key={courier.id} className="admin-item">
                  <div>
                    <div className="action-buttons">
                      <button onClick={() => handleEditClick(courier)}>✏️</button>
                      <button onClick={() => handleDeleteClick(courier.id)}>
                        ❌
                      </button>
                    </div>
                    <p>ID: {courier.id}</p>
                    <strong>{courier.name}</strong>
                    <p>Логин: {courier.username}</p>
                    <p>Телефон: {courier.phone}</p>
                    <p>Адрес: {courier.address}</p>
                    <p>Роли: {courier.roles.join(", ")}</p>
                    {courierShiftData ? (
                      <div>
                        <p>На смене: {courierShiftData.onShift ? "Да" : "Нет"}</p>
                        <p>На доставке: {courierShiftData.onDelivery ? "Да" : "Нет"}</p>
                      </div>
                    ) : (
                      <p>На смене: Нет</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {showForm && (
            <div className="admin-form">
              <h3>{editMode ? "Редактировать курьера" : "Добавить курьера"}</h3>
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
                  placeholder="Введите ФИО курьера"
                />
                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
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
                  placeholder="Введите логин курьера"
                />
                {formErrors.username && <span className="error-message">{formErrors.username}</span>}
              </div>
              {!editMode && (
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
                    placeholder="Введите пароль курьера"
                  />
                  {formErrors.password && (
                    <span className="error-message">{formErrors.password}</span>
                  )}
                </div>
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
                  placeholder="Введите телефон курьера"
                />
                {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
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
                  placeholder="Введите адрес курьера"
                />
              </div>
              <div className="form-buttons">
                <button onClick={handleFormSubmit} className="admin-save-button">
                  ✔️ Сохранить
                </button>
                <button onClick={() => setShowForm(false)} className="admin-cancel-button">
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

export default CouriersPage;
