import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllKitchens } from "../../http/adminService";
import "./Admin.css";

const DirectoryPage = () => {
  const navigate = useNavigate();
  const [kitchens, setKitchens] = useState([]);
  const dishTypes = [
    { id: 0, name: "Закуска" },
    { id: 1, name: "Салат" },
    { id: 2, name: "Суп" },
    { id: 3, name: "Горячее" },
    { id: 4, name: "Десерт" },
    { id: 5, name: "Напиток" },
  ];
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false);

  useEffect(() => {
    loadKitchens();
  }, []);

  const loadKitchens = async () => {
    try {
      const data = await getAllKitchens();
      setKitchens(data);
    } catch (error) {
      console.error("Ошибка загрузки видов кухни:", error);
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
      <h2>Справочник</h2>
      <div className="directory-container">
        <div className="kitchen-directory">
          <h3>Виды кухни</h3>
          <ul>
            {kitchens.map((kitchen) => (
              <li key={kitchen.id} className="directory-item">
                <p>ID: {kitchen.id}</p>
                <p>Название: {kitchen.name}</p>
                <p>Описание: {kitchen.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="dish-types-directory">
          <h3>Типы блюд</h3>
          <ul>
            {dishTypes.map((type) => (
              <li key={type.id} className="directory-item">
                <p>ID: {type.id}</p>
                <p>Название: {type.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
