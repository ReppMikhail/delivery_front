import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllManagers,
  getAllCustomers,
  getAllCouriers,
  createEmployee,
  updateUser,
  deleteUser,
} from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";
import ValidationHelper from "../../components/ValidationHelper";

const ManagersPage = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
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
      console.error("Error loading managers:", error);
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
      await deleteUser(id);
      loadManagers();
    } catch (error) {
      console.error("Error deleting manager:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      console.log('Submitting form data:', formData);
      const errors = {};
  
      // Валидация полей
      const nameError = ValidationHelper.validateName(formData.name);
      if (nameError) errors.name = nameError;
  
      const phoneError = ValidationHelper.validatePhone(formData.phone);
      if (phoneError) errors.phone = phoneError;
  
      const emailError = ValidationHelper.validateEmail(formData.username);
      if (emailError) errors.username = emailError;
  
      if (!editMode) {
        const passwordError = ValidationHelper.validatePassword(formData.password);
        if (passwordError) errors.password = passwordError;
      }
  
      if (Object.keys(errors).length > 0) {
        alert(Object.values(errors).join("\n"));
        return;
      }
  
      console.log('Validation passed. Checking username uniqueness...');
      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);
      const allUsers = [...customers, ...managers, ...couriers];
  
      const isUsernameTaken = allUsers.some(
        (user) =>
          user.username === formData.username &&
          (!editMode || user.id !== editManagerId)
      );
  
      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        return;
      }
  
      console.log(editMode ? 'Updating manager...' : 'Creating new manager...');
      if (editMode) {
        const updatedData = {
          name: formData.name,
          username: formData.username,
          phone: formData.phone,
        };
        await updateUser(editManagerId, updatedData);
      } else {
        const newManagerData = {
          ...formData,
          passwordConfirmation: formData.password,
          roles: ["ROLE_MANAGER"],
        };
        await createEmployee(newManagerData);
      }
  
      alert('Успешно сохранено!');
      setShowForm(false);
      loadManagers();
    } catch (error) {
      console.error('Error submitting form:', error.response || error);
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
                {formData.name.length > 0 && ValidationHelper.validateName(formData.name) && (
                  <span className="error-message">
                    {ValidationHelper.validateName(formData.name)}
                  </span>
                )}
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
                {formData.username.length > 0 && ValidationHelper.validateEmail(formData.username) && (
                  <span className="error-message">
                    {ValidationHelper.validateEmail(formData.username)}
                  </span>
                )}
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
                    placeholder="Введите пароль менеджера"
                  />
                  {formData.password.length > 0 && ValidationHelper.validatePassword(formData.password) && (
                    <span className="error-message">
                      {ValidationHelper.validatePassword(formData.password)}
                    </span>
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
                  placeholder="Введите телефон менеджера"
                />
                {formData.phone.length > 0 && ValidationHelper.validatePhone(formData.phone) && (
                  <span className="error-message">
                    {ValidationHelper.validatePhone(formData.phone)}
                  </span>
                )}
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
