import React, { useState, useEffect, useRef } from "react";
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
import ImageComponent from "../ImageComponent";

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
  const dishFormRef = useRef(null);
  const [errors, setErrors] = useState({}); // Состояние для ошибок

  // Загрузка данных
  useEffect(() => {
    loadMenuItems();
    loadIngredients();
    loadKitchens();
    if (showForm && dishFormRef.current) {
      // Прокручиваем к форме только когда она отображена
      dishFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  const loadMenuItems = async () => {
    try {
      const data = await getAllMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error("Ошибка загрузки блюд:", error);
    }
  };

  const validateForm = () => {
    const validationErrors = {};
  
    // Проверка всех полей
    if (!formData.name) validationErrors.name = "Название обязательно.";
    if (!formData.description) validationErrors.description = "Описание обязательно.";
    if (!formData.price || isNaN(formData.price)) {
      validationErrors.price = "Введите корректную цену.";
    } else if (formData.price <= 0) {
      validationErrors.price = "Цена должна быть больше 0.";
    }
    if (!formData.category) validationErrors.category = "Категория обязательна.";
    if (!formData.weight || isNaN(formData.weight)) {
      validationErrors.weight = "Введите корректный вес.";
    } else if (formData.weight <= 0) {
      validationErrors.weight = "Вес должен быть больше 0.";
    }
    if (!formData.calories || isNaN(formData.calories)) {
      validationErrors.calories = "Введите корректное количество калорий.";
    } else if (formData.calories <= 0) {
      validationErrors.calories = "Калории должны быть больше 0.";
    }
    if (formData.ingredients.length === 0) validationErrors.ingredients = "Выберите хотя бы один ингредиент.";
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
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
    // Удаляем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
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
      const updatedMenuItems = menuItems.map((item) =>
        item.id === menuItemId
          ? { ...item, imageUrl: URL.createObjectURL(selectedImage) } // Обновляем URL картинки
          : item
      );
      setMenuItems(updatedMenuItems); // Обновляем состояние
      setSelectedImage(null); // Сбрасываем выбранное изображение
    } catch (error) {
      alert(
        `Ошибка загрузки картинки: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  

  const handleAddClick = () => {
    setShowForm(true); // Показать форму
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
    scrollToForm(); // Прокручиваем к форме при добавлении
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
    scrollToForm(); // Прокручиваем к форме при добавлении
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteMenuItem(id);
      loadMenuItems();
    } catch (error) {
      console.error("Ошибка удаления блюда:", error);
    }
  };

  const checkIfNameExists = async (name) => {
    try {
      const data = await getAllMenuItems(); // Получаем все блюда
      const itemExists = data.some(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      ); // Сравниваем название без учета регистра
      return itemExists;
    } catch (error) {
      console.error("Ошибка при проверке существующего названия:", error);
      return false; // В случае ошибки возвращаем false
    }
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return; // Если валидация не прошла, выходим

    try {
      const formattedIngredients = formData.ingredients.map((id) => ({ id }));
      const requestData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        availabilityStatus: formData.availabilityStatus.toString(),
        weight: parseInt(formData.weight),
        calories: parseInt(formData.calories),
        kitchen: formData.kitchen ? { id: formData.kitchen.id } : null,
        ingredients: formattedIngredients,
      };

      if (editMode) {
        if (!checkIfNameExists) {
          requestData.id = editItemId;
          await updateMenuItem(requestData);
        }
        else {
          alert("Блюдо уже существует");
        }
      } else {
        if (!checkIfNameExists)
        await createMenuItem(requestData);
      else {
        alert("Блюдо уже существует");
      }
      }

      setShowForm(false);
      loadMenuItems();
    } catch (error) {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };
  

  const scrollToForm = () => {
    if (dishFormRef.current) {
      dishFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="admin-page">
      <NavigationBar></NavigationBar>

      <div className="admin-content">
        <div>
          <h2>Список блюд</h2>
          <button onClick={handleAddClick} className="admin-add-item-button">
            Добавить блюдо
          </button>
          <ul className="admin-list">
            {menuItems.map((item) => (
              <li key={item.id} className="admin-item">
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
                  <p className="admin-form-p-description ">Описание: {item.description}</p>
                  <p>Цена: {item.price} руб.</p>
                  <p>Категория: {item.category}</p>
                  <p>Кухня: {item.kitchen?.name || "Не указано"}</p>
                  <p>Вес: {item.weight} г</p>
                  <p>Калории: {item.calories} ккал</p>
                  <p>
                    Ингредиенты:{" "}
                    {item.ingredients.map((ing) => ing.name).join(", ")}
                  </p>
                  {/* Добавление изображения */}
                  <div className="admin-item-image-container">
                    <ImageComponent
                      id={item.id}
                      dish={item}
                      className="admin-item-image"
                    />
                  </div>
                </div>
                {/* Блок загрузки изображения */}
                <div className="upload-container">
                  <div className="upload-container-info">
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
                  <button onClick={() => handleUploadImage(item.id)}
                    className="upload-image-button">
                    Загрузить картинку
                  </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {showForm && (
            <div ref={dishFormRef} className="admin-form">
              <h3>{editMode ? "Редактировать блюдо" : "Добавить блюдо"}</h3>
              <div className="form-group">
                <label htmlFor="name" className="admin-form-label">
                  Название:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Введите название блюда"
                  className="admin-form-input"
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="description" className="admin-form-label">
                  Описание:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Введите описание блюда"
                  className="admin-form-textarea"
                ></textarea>
                {errors.description && <p className="error-text">{errors.description}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="price" className="admin-form-label">
                  Цена (руб.):
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Укажите цену блюда"
                  className="admin-form-input"
                />
                {errors.price && <p className="error-text">{errors.price}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="category" className="admin-form-label">
                  Категория:
                </label>
                <div className="custom-select-container">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="admin-form-select"
                  >
                    <option value=""> </option>{" "}
                    {/* Пустая опция для управления placeholder */}
                    {[
                      "Закуска",
                      "Салат",
                      "Суп",
                      "Основное блюдо", // Обновлено с "Горячее" на "Основное блюдо"
                      "Десерт",
                      "Напиток",
                      "Гарнир", // Новая категория
                    ].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="error-text">{errors.category}</p>}
                  {formData.category === "" && (
                    <span className="placeholder">Выберите категорию</span> // Подсказка для категорий
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="kitchen" className="admin-form-label">
                  Кухня:
                </label>
                <div className="custom-select-container">
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
                    className="admin-form-select"
                  >
                    <option value=""> </option>{" "}
                    {/* Пустая опция для управления placeholder */}
                    {kitchens.map((kitchen) => (
                      <option key={kitchen.id} value={kitchen.id}>
                        {kitchen.name}
                      </option>
                    ))}
                  </select>
                  {errors.kitchen && <p className="error-text">{errors.kitchen}</p>}
                  {formData.kitchen?.id === "" || !formData.kitchen ? (
                    <span className="placeholder">Выберите кухню</span> // Подсказка для кухни
                  ) : null}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="weight" className="admin-form-label">
                  Вес (граммы):
                </label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  placeholder="Укажите вес блюда"
                  className="admin-form-input"
                />
                {errors.weight && <p className="error-text">{errors.weight}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="calories" className="admin-form-label">
                  Калории:
                </label>
                <input
                  id="calories"
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleFormChange}
                  placeholder="Укажите калорийность блюда"
                  className="admin-form-input"
                />
                {errors.calories && <p className="error-text">{errors.calories}</p>}
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
                                                      {errors.ingredients && <p className="error-text">{errors.ingredients}</p>}
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

export default AdminPage;
