import React, { useState, useEffect } from "react";
import { getAllIngredients, postIngredient, putIngredient, deleteIngredient } from "../../http/adminService";
import "./Admin.css";
import NavigationBar from "../../components/NavigationBar";

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [editMode, setEditMode] = useState(false);
  const [editIngredientId, setEditIngredientId] = useState(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const data = await getAllIngredients();
      setIngredients(data);
    } catch (error) {
      console.error("Ошибка загрузки ингредиентов:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClick = () => {
    setShowForm(true);
    setFormData({ name: "" });
    setEditMode(false);
  };

  const handleEditClick = (ingredient) => {
    setShowForm(true);
    setFormData({ name: ingredient.name });
    setEditMode(true);
    setEditIngredientId(ingredient.id);
  };

  const handleDeleteClick = async (id) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
  
      const headers = {
        Authorization: `Bearer ${authData.accessToken}`,
      };
  
      // Загружаем активные блюда
      const activeMenuItems = await fetch("http://localhost:8080/api/v1/menuitems", {
        headers,
      }).then((res) => res.json());
  
      // Загружаем архивные блюда
      const archivedMenuItems = await fetch("http://localhost:8080/api/v1/menuitems/archive", {
        headers,
      }).then((res) => res.json());
  
      // Фильтруем блюда по наличию ингредиента
      const usedInActive = activeMenuItems.filter((item) =>
        item.ingredients.some((ingredient) => ingredient.id === id)
      );
      const usedInArchive = archivedMenuItems.filter((item) =>
        item.ingredients.some((ingredient) => ingredient.id === id)
      );
  
      if (usedInActive.length > 0 || usedInArchive.length > 0) {
        const activeNames = usedInActive.map((item) => item.name).join(", ");
        const archivedNames = usedInArchive.map((item) => item.name).join(", ");
  
        let message = "Нельзя удалить ингредиент. Он используется в следующих блюдах:\n";
        if (activeNames) {
          message += `\nВ меню: ${activeNames}`;
        }
        if (archivedNames) {
          message += `\nВ архиве: ${archivedNames}`;
        }
  
        alert(message);
        return;
      }
  
      // Подтверждение удаления
      if (window.confirm("Вы уверены, что хотите удалить этот ингредиент?")) {
        await deleteIngredient(id);
        loadIngredients();
      }
    } catch (error) {
      console.error("Ошибка при удалении ингредиента:", error);
    }
  };
  
  
  

  const handleFormSubmit = async () => {
    try {
      // Проверяем, существует ли ингредиент с таким же именем
      const existingIngredient = ingredients.find(
        (ingredient) => ingredient.name.toLowerCase() === formData.name.toLowerCase()
      );
  
      if (existingIngredient && (!editMode || existingIngredient.id !== editIngredientId)) {
        alert("Ингредиент с таким именем уже существует. Пожалуйста, выберите другое имя.");
        return;
      }
  
      if (editMode) {
        // Обновление ингредиента
        await putIngredient({ id: editIngredientId, name: formData.name });
      } else {
        // Добавление нового ингредиента
        await postIngredient({ name: formData.name });
      }
  
      setShowForm(false);
      loadIngredients();
    } catch (error) {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="admin-page">
      <NavigationBar />
      <div className="admin-content">
        <div>
        <h2>Список ингредиентов</h2>
        <button onClick={handleAddClick} className="admin-add-item-button">
          Добавить ингредиент
        </button>
        <ul className="admin-list">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="admin-item">
              <div>
                <div className="action-buttons">
                  <button onClick={() => handleEditClick(ingredient)}>✏️</button>
                  <button onClick={() => handleDeleteClick(ingredient.id)}>❌</button>
                </div>
                <p>ID: {ingredient.id}</p>
                <strong>{ingredient.name}</strong>
              </div>
            </li>
          ))}
        </ul>

        {showForm && (
          <div className="admin-form">
            <h3>{editMode ? "Редактировать ингредиент" : "Добавить ингредиент"}</h3>
            <div className="form-group">
              <label htmlFor="name" className="admin-form-label">
                Название ингредиента:
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="admin-form-input"
                placeholder="Введите название ингредиента"
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

export default IngredientsPage;
