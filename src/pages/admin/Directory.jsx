import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllKitchens } from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";

const DirectoryPage = () => {
  const navigate = useNavigate();
  const [kitchens, setKitchens] = useState([]);
  const dishTypes = [
    { id: 0, name: "Закуска" },
    { id: 1, name: "Салат" },
    { id: 2, name: "Суп" },
    { id: 3, name: "Основное блюдо" },
    { id: 4, name: "Десерт" },
    { id: 5, name: "Напиток" },
    { id: 6, name: "Гарнир" },
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
      <NavigationBar></NavigationBar>
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
