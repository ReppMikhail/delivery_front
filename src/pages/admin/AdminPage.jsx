import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllMenuItems,
  createMenuItem,
  addImage,
  updateMenuItem,
  deleteMenuItem,
  getAllIngredients,
  getAllKitchens,
} from "../../http/adminService";
import "./Admin.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("Блюда");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availabilityStatus: true,
    weight: "",
    calories: "",
    ingredients: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false); // Состояние для выпадающего списка "О нас"

  // Загрузка данных
  useEffect(() => {
    loadMenuItems();
    loadIngredients();
    loadKitchens();
  }, []);

  const loadMenuItems = async () => {
    try {
      const data = await getAllMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error("Ошибка загрузки блюд:", error);
    }
  };

  const loadIngredients = async () => {
    try {
      const data = await getAllIngredients();
      setIngredients(data);
    } catch (error) {
      console.error("Ошибка загрузки ингредиентов:", error);
    }
  };

  const loadKitchens = async () => {
    try {
      const data = await getAllKitchens();
      setKitchens(data);
    } catch (error) {
      console.error("Ошибка загрузки видов кухни:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updatedIngredients = checked
        ? [...formData.ingredients, parseInt(value)]
        : formData.ingredients.filter((id) => id !== parseInt(value));
      setFormData({ ...formData, ingredients: updatedIngredients });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/png") {
        alert("Пожалуйста, выберите изображение в формате PNG.");
        e.target.value = ""; // Сбрасываем выбор файла
        return;
      }
      setSelectedImage(file);
    }
  };
  
  
  const handleUploadImage = async (menuItemId) => {
    if (!selectedImage) {
      alert("Пожалуйста, выберите изображение.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedImage);
  
    try {
      await addImage(menuItemId, formData);
      alert("Картинка успешно загружена!");
      setSelectedImage(null);
    } catch (error) {
      alert(`Ошибка загрузки картинки: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      availabilityStatus: true,
      weight: "",
      calories: "",
      ingredients: [],
    });
    setEditMode(false);
  };

  const handleEditClick = (item) => {
    setShowForm(true);
    setFormData({
      ...item,
      ingredients: item.ingredients.map((ing) => ing.id),
      kitchen: item.kitchen || null, // Установить выбранный вид кухни
    });
    setEditMode(true);
    setEditItemId(item.id);
  };
  

  const handleDeleteClick = async (id) => {
    try {
      await deleteMenuItem(id);
      loadMenuItems();
    } catch (error) {
      console.error("Ошибка удаления блюда:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const formattedIngredients = formData.ingredients.map((id) => {
        const ingredient = ingredients.find((ing) => ing.id === id);
        return ingredient ? { id: ingredient.id, name: ingredient.name } : null;
      }).filter((ing) => ing !== null);
  
      const requestData = {
        ...formData,
        ingredients: formattedIngredients,
        kitchen: { id: formData.kitchen.id }, // Указать выбранный вид кухни
        ...(editMode ? { id: editItemId } : {}),
      };
  
      if (editMode) {
        await updateMenuItem(requestData);
      } else {
        delete requestData.id;
        await createMenuItem(requestData);
      }
  
      setShowForm(false);
      loadMenuItems();
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
      
      <div className="admin-content">
        
          <div>
            <h2>Список блюд</h2>
            <button onClick={handleAddClick}>Добавить блюдо</button>
            <ul className="menu-list">
              {menuItems.map((item) => (
                <li key={item.id} className="menu-item">
                  <div>
                    <p>ID: {item.id}</p> {/* Добавлено отображение ID */}
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                    <p>Цена: {item.price} руб.</p>
                    <p>Категория: {item.category}</p>
                    <p>Кухня: {item.kitchen?.name || "Не указано"}</p>
                    <p>Доступность: {item.availabilityStatus ? "Доступно" : "Не доступно"}</p>
                    <p>Вес: {item.weight} г</p>
                    <p>Калории: {item.calories} ккал</p>
                    <p>Ингредиенты: {item.ingredients.map((ing) => ing.name).join(", ")}</p>
                  </div>
                  <div>
                    <button onClick={() => handleEditClick(item)}>✏️</button>
                    <button onClick={() => handleDeleteClick(item.id)}>❌</button>
                  </div>
                  <div>
                    <input
                    type="file"
                    accept="image/png"
                    onChange={handleImageChange}
                    />
                    <button onClick={() => handleUploadImage(item.id)}>Загрузить картинку</button>
                    </div>
                </li>
              ))}
            </ul>

            {showForm && (
              <div className="menu-form">
                <h3>{editMode ? "Редактировать блюдо" : "Добавить блюдо"}</h3>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Название"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Описание"
                ></textarea>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Цена"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="">Выберите категорию</option>
                  {["Закуска", "Салат", "Суп", "Горячее", "Десерт", "Напиток"].map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
                <select
                  name="kitchenId"
                  value={formData.kitchen?.id || ""}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    kitchen: kitchens.find((kitchen) => kitchen.id === parseInt(e.target.value)),
                  })}
                >
                  <option value="">Выберите вид кухни</option>
                  {kitchens.map((kitchen) => (
                    <option key={kitchen.id} value={kitchen.id}>
                      {kitchen.name}
                      </option>
                    ))
                  }
                </select>

                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="availabilityStatus"
                      checked={formData.availabilityStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availabilityStatus: e.target.checked,
                        })
                      }
                    />
                    Доступность
                  </label>
                </div>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  placeholder="Вес (граммы)"
                />
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleFormChange}
                  placeholder="Калории"
                />
                <div className="checkbox-group">
                  <h4>Ингредиенты:</h4>
                  {ingredients.map((ingredient) => (
                    <label key={ingredient.id}>
                      <input
                        type="checkbox"
                        value={ingredient.id}
                        checked={formData.ingredients.includes(ingredient.id)}
                        onChange={handleFormChange}
                      />
                      {ingredient.name}
                    </label>
                  ))}
                </div>
                <button onClick={handleFormSubmit}>✔️</button>
                <button onClick={() => setShowForm(false)}>Отмена</button>
              </div>
            )}
          </div>
        
      </div>
    </div>
  );
};

export default AdminPage;