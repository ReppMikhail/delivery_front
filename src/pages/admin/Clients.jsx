import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCustomers,
  createCustomer,
  updateUser,
  deleteUser,
} from "../../http/adminService";
import "./Admin.css";

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
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false);

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
      await deleteUser(id);
      loadClients();
    } catch (error) {
      console.error("Error deleting client:", error);
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
        await updateUser(editClientId, updatedData);
      } else {
        await createCustomer(formData);
      }

      setShowForm(false);
      loadClients();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
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
        <button
          onClick={() => setAboutDropdownVisible(!aboutDropdownVisible)}
        >
          О нас
        </button>
        {aboutDropdownVisible && (
          <div className="dropdown-popup">
            <button onClick={() => navigate("/about/system")}>О системе</button>
            <button onClick={() => navigate("/about/developers")}>
              О разработчиках
            </button>
          </div>
        )}
        <span>+7 937 123 98 56</span>
      </header>
      <h2>Список клиентов</h2>
      <button onClick={handleAddClick}>Добавить клиента</button>

      <ul className="client-list">
        {clients.map((client) => (
          <li key={client.id} className="client-item">
            <div>
              <p>ID: {client.id}</p>
              <strong>{client.name}</strong>
              <p>Логин: {client.username}</p>
              <p>Телефон: {client.phone}</p>
              <p>Адрес: {client.address}</p>
              <p>Роли: {client.roles.join(", ")}</p>
            </div>
            <div>
              <button onClick={() => handleEditClick(client)}>✏️</button>
              <button onClick={() => handleDeleteClick(client.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="client-form">
          <h3>{editMode ? "Редактировать клиента" : "Добавить клиента"}</h3>
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

export default ClientsPage;
