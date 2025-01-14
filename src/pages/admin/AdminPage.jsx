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
import NavigationBar from "../../components/NavigationBar";

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
  const [fileNames, setFileNames] = useState({});

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

  const handleImageChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/png") {
        alert("Пожалуйста, выберите изображение в формате PNG.");
        e.target.value = ""; // Сбрасываем выбор файла
        return;
      }
      setSelectedImage(file);

      // Сохраняем имя файла для конкретного блюда
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [id]: file.name,
      }));
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
      alert(
        `Ошибка загрузки картинки: ${
          error.response?.data?.message || error.message
        }`
      );
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
      // Форматируем ингредиенты в ожидаемый сервером формат
      const formattedIngredients = formData.ingredients.map((id) => ({ id }));
  
      // Создаем объект данных, который будет отправлен на сервер
      const requestData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price), // Убедитесь, что цена отправляется как число
        category: formData.category,
        availabilityStatus: formData.availabilityStatus.toString(), // Приводим к строке "true" или "false"
        weight: parseInt(formData.weight), // Убедитесь, что вес отправляется как число
        calories: parseInt(formData.calories), // Убедитесь, что калории отправляются как число
        kitchen: formData.kitchen ? { id: formData.kitchen.id } : null,
        ingredients: formattedIngredients,
      };
  
      if (editMode) {
        requestData.id = editItemId; // Добавляем ID, если в режиме редактирования
        await updateMenuItem(requestData);
      } else {
        await createMenuItem(requestData); // Создаем новое блюдо
      }
  
      setShowForm(false); // Закрываем форму
      loadMenuItems(); // Обновляем список блюд
    } catch (error) {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };
  
  

  return (
    <div className="admin-page">
      <NavigationBar></NavigationBar>

      <div className="admin-content">
        <div>
          <h2>Список блюд</h2>
          <button onClick={handleAddClick} className="admin-add-dish-button">
            Добавить блюдо
          </button>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.id} className="menu-item">
                <div>
                  {/* Блок кнопок в правом верхнем углу */}
                  <div className="action-buttons">
                    <button onClick={() => handleEditClick(item)}>✏️</button>
                    <button onClick={() => handleDeleteClick(item.id)}>
                      ❌
                    </button>
                  </div>
                  <p>ID: {item.id}</p> {/* Добавлено отображение ID */}
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                  <p>Цена: {item.price} руб.</p>
                  <p>Категория: {item.category}</p>
                  <p>Кухня: {item.kitchen?.name || "Не указано"}</p>
                  <p>
                    Доступность:{" "}
                    {item.availabilityStatus ? "Доступно" : "Не доступно"}
                  </p>
                  <p>Вес: {item.weight} г</p>
                  <p>Калории: {item.calories} ккал</p>
                  <p>
                    Ингредиенты:{" "}
                    {item.ingredients.map((ing) => ing.name).join(", ")}
                  </p>
                </div>
                {/* Блок загрузки изображения */}
                <div className="upload-container">
                  <label
                    htmlFor={`upload-${item.id}`}
                    className="choise-image-button"
                  >
                    Выберите изображение
                  </label>
                  <input
                    id={`upload-${item.id}`}
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleImageChange(e, item.id)} // Передача ID
                  />
                  <span className="file-name">
                    {fileNames[item.id] || "Файл не выбран"}
                  </span>
                  <button onClick={() => handleUploadImage(item.id)}>
                    Загрузить картинку
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {showForm && (
            <div className="menu-form">
              <h3>{editMode ? "Редактировать блюдо" : "Добавить блюдо"}</h3>
              <div className="form-group">
                <label htmlFor="name">Название:</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Введите название блюда"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Описание:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Введите описание блюда"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="price">Цена (руб.):</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Укажите цену блюда"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Категория:</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="">Выберите категорию</option>
                  {[
                    "Закуска",
                    "Салат",
                    "Суп",
                    "Горячее",
                    "Десерт",
                    "Напиток",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="kitchen">Кухня:</label>
                <select
                  id="kitchen"
                  name="kitchenId"
                  value={formData.kitchen?.id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kitchen: kitchens.find(
                        (kitchen) => kitchen.id === parseInt(e.target.value)
                      ),
                    })
                  }
                >
                  <option value="">Выберите кухню</option>
                  {kitchens.map((kitchen) => (
                    <option key={kitchen.id} value={kitchen.id}>
                      {kitchen.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
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
              <div className="form-group">
                <label htmlFor="weight">Вес (граммы):</label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  placeholder="Укажите вес блюда"
                />
              </div>
              <div className="form-group">
                <label htmlFor="calories">Калории:</label>
                <input
                  id="calories"
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleFormChange}
                  placeholder="Укажите калорийность блюда"
                />
              </div>
              <div className="form-group checkbox-group">
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
              <div className="form-buttons">
                <button onClick={handleFormSubmit}>✔️ Сохранить</button>
                <button onClick={() => setShowForm(false)}>Отмена</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
