import React, { useState, useEffect } from "react";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllIngredients,
} from "../http/adminService";
import "./AdminPage.css"; // Для кастомных стилей

const AdminPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
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

  // Загрузка данных
  useEffect(() => {
    loadMenuItems();
    loadIngredients();
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
  
      // Формируем тело запроса
      const requestData = {
        ...formData,
        ingredients: formattedIngredients,
        ...(editMode ? { id: editItemId } : {}), // Добавляем ID только при редактировании
      };
  
      if (editMode) {
        await updateMenuItem(requestData);
      } else {
        delete requestData.id; // Убираем ID для создания нового блюда
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
      <nav className="admin-nav">
        {["Блюда", "Клиенты", "Менеджеры", "Курьеры"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {activeTab === "Блюда" && (
          <div>
            <h2>Список блюд</h2>
            <button onClick={handleAddClick}>Добавить блюдо</button>
            <ul className="menu-list">
              {menuItems.map((item) => (
                <li key={item.id} className="menu-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <button onClick={() => handleEditClick(item)}>✏️</button>
                    <button onClick={() => handleDeleteClick(item.id)}>❌</button>
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
        )}
        {/* Здесь можно добавить содержимое для других вкладок */}
      </div>
    </div>
  );
};

export default AdminPage;














// ВРОДЕ ПОБОЛЬШЕ ФУНКЦИОНАЛА

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getAllMenuItems,
//   createMenuItem,
//   updateMenuItem,
//   deleteMenuItem,
// } from "../http/adminService";
// import "./AdminPage.css";

// const AdminPage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dishes, setDishes] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [newDish, setNewDish] = useState({
//     name: "",
//     price: "",
//     calories: "",
//     ingredients: "",
//     cuisine: "",
//     type: "",
//     description: "",
//   });

//   useEffect(() => {
//     // Fetch the dishes from the backend
//     const fetchDishes = async () => {
//       try {
//         const data = await getAllMenuItems();
//         const formattedDishes = data.map((item) => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           calories: `${item.calories} ккал`,
//           ingredients: item.ingredients.map((ing) => ing.name).join(", "),
//           cuisine: item.category,
//           type: item.category,
//           description: item.description,
//         }));
//         setDishes(formattedDishes);
//       } catch (error) {
//         console.error("Failed to fetch dishes:", error);
//       }
//     };
//     fetchDishes();
//   }, []);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const filteredDishes = dishes.filter((dish) =>
//     dish.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleAddDish = () => {
//     setNewDish({
//       name: "",
//       price: "",
//       calories: "",
//       ingredients: "",
//       cuisine: "",
//       type: "",
//       description: "",
//     });
//     setEditingId("new");
//   };

//   const handleEditDish = (id) => {
//     setEditingId(id);
//     setNewDish(dishes.find((dish) => dish.id === id));
//   };

//   const handleDeleteDish = async (id) => {
//     try {
//       await deleteMenuItem(id);
//       setDishes(dishes.filter((dish) => dish.id !== id));
//     } catch (error) {
//       console.error("Failed to delete dish:", error);
//     }
//   };

//   const handleSaveDish = async () => {
//     try {
//       if (editingId === "new") {
//         const createdDish = await createMenuItem(newDish);
//         setDishes([...dishes, createdDish]);
//       } else {
//         const updatedDish = await updateMenuItem(editingId, newDish);
//         setDishes(dishes.map((dish) => (dish.id === editingId ? updatedDish : dish)));
//       }
//       setEditingId(null);
//     } catch (error) {
//       console.error("Failed to save dish:", error);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewDish({ ...newDish, [name]: value });
//   };

//   return (
//     <div className="admin-page">
//       <header className="admin-navbar">
//         <button>О нас</button>
//         <button>Блюда</button>
//         <button>Клиенты</button>
//         <button>Менеджеры</button>
//         <button>Курьеры</button>
//         <button>Заказы</button>
//       </header>

//       <div className="admin-container">
//         <h2>Блюда</h2>
//         <div className="admin-controls">
//           <button onClick={handleAddDish} className="add-button">Добавить</button>
//           <input
//             type="text"
//             placeholder="Введите маску"
//             value={searchQuery}
//             onChange={handleSearch}
//           />
//         </div>

//         <table className="admin-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Название</th>
//               <th>Цена</th>
//               <th>Калорийность</th>
//               <th>Состав</th>
//               <th>Вид кухни</th>
//               <th>Тип блюда</th>
//               <th>Описание</th>
//               <th>Действия</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDishes.map((dish) => (
//               <tr key={dish.id}>
//                 <td>{dish.id}</td>
//                 <td>{editingId === dish.id ? (
//                   <input name="name" value={newDish.name} onChange={handleInputChange} />
//                 ) : (
//                   dish.name
//                 )}</td>
//                 <td>{editingId === dish.id ? (
//                   <input name="price" value={newDish.price} onChange={handleInputChange} />
//                 ) : (
//                   dish.price
//                 )}</td>
//                 <td>{editingId === dish.id ? (
//                   <input name="calories" value={newDish.calories} onChange={handleInputChange} />
//                 ) : (
//                   dish.calories
//                 )}</td>
//                 <td>{editingId === dish.id ? (
//                   <input name="ingredients" value={newDish.ingredients} onChange={handleInputChange} />
//                 ) : (
//                   dish.ingredients
//                 )}</td>
//                 <td>{editingId === dish.id ? (
//                   <input name="cuisine" value={newDish.cuisine} onChange={handleInputChange} />
//                 ) : (
//                   dish.cuisine
//                 )}</td>
//                 <td>{editingId === dish.id ? (
//                   <input name="type" value={newDish.type} onChange={handleInputChange} />
//                 ) : (
//                   dish.type
//                 )}</td>
//                 <td>{editingId === dish.id ? (
//                   <input name="description" value={newDish.description} onChange={handleInputChange} />
//                 ) : (
//                   dish.description
//                 )}</td>
//                 <td>
//                   {editingId === dish.id ? (
//                     <>
//                       <button onClick={handleSaveDish}>✔</button>
//                       <button onClick={handleCancelEdit}>✖</button>
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={() => handleEditDish(dish.id)}>✎</button>
//                       <button onClick={() => handleDeleteDish(dish.id)}>✖</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}

//             {editingId === "new" && (
//               <tr>
//                 <td>New</td>
//                 <td><input name="name" value={newDish.name} onChange={handleInputChange} /></td>
//                 <td><input name="price" value={newDish.price} onChange={handleInputChange} /></td>
//                 <td><input name="calories" value={newDish.calories} onChange={handleInputChange} /></td>
//                 <td><input name="ingredients" value={newDish.ingredients} onChange={handleInputChange} /></td>
//                 <td><input name="cuisine" value={newDish.cuisine} onChange={handleInputChange} /></td>
//                 <td><input name="type" value={newDish.type} onChange={handleInputChange} /></td>
//                 <td><input name="description" value={newDish.description} onChange={handleInputChange} /></td>
//                 <td>
//                   <button onClick={handleSaveDish}>✔</button>
//                   <button onClick={handleCancelEdit}>✖</button>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;







// ВЕРСИЯ ПОКРАСИВЕЕ

// const AdminPage = () => {
//   const navigate = useNavigate();
//   const [dishes, setDishes] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isEditing, setIsEditing] = useState(null);
//   const [newDish, setNewDish] = useState({
//     name: "",
//     price: "",
//     calories: "",
//     ingredients: "",
//     cuisine: "",
//     type: "",
//     description: "",
//   });

//   useEffect(() => {
//     fetchDishes();
//   }, []);

//   const fetchDishes = async () => {
//     try {
//       const response = await getAllMenuItems();
//       setDishes(response);
//     } catch (error) {
//       console.error("Ошибка при загрузке блюд:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteMenuItem(id);
//       setDishes(dishes.filter((dish) => dish.id !== id));
//     } catch (error) {
//       console.error("Ошибка при удалении блюда:", error);
//     }
//   };

//   const handleAddDish = async () => {
//     try {
//       const ingredientsArray = newDish.ingredients.split(",").map((name) => ({ name: name.trim() }));
//       const dishData = {
//         ...newDish,
//         ingredients: ingredientsArray,
//       };
//       const response = await createMenuItem(dishData);
//       setDishes([...dishes, response]);
//       setNewDish({
//         name: "",
//         price: "",
//         calories: "",
//         ingredients: "",
//         cuisine: "",
//         type: "",
//         description: "",
//       });
//     } catch (error) {
//       console.error("Ошибка при добавлении блюда:", error);
//     }
//   };

//   const handleEditDish = (id) => {
//     setIsEditing(id);
//   };

//   const handleSaveDish = async (id) => {
//     try {
//       const updatedDish = dishes.find((dish) => dish.id === id);
//       const ingredientsArray = updatedDish.ingredients.split(",").map((name) => ({ name: name.trim() }));
//       const dishData = {
//         ...updatedDish,
//         ingredients: ingredientsArray,
//       };
//       await updateMenuItem(id, dishData);
//       setIsEditing(null);
//       fetchDishes();
//     } catch (error) {
//       console.error("Ошибка при сохранении блюда:", error);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(null);
//     fetchDishes();
//   };

//   const handleInputChange = (id, field, value) => {
//     setDishes(
//       dishes.map((dish) =>
//         dish.id === id ? { ...dish, [field]: value } : dish
//       )
//     );
//   };

//   const filteredDishes = dishes.filter((dish) =>
//     dish.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="admin-page">
//       <header className="navbar">
//         <div className="navbar-left">
//           <button onClick={() => navigate("/dishes")}>Блюда</button>
//           <button onClick={() => navigate("/clients")}>Клиенты</button>
//           <button onClick={() => navigate("/managers")}>Менеджеры</button>
//           <button onClick={() => navigate("/couriers")}>Курьеры</button>
//           <button onClick={() => navigate("/orders")}>Заказы</button>
//         </div>
//       </header>

//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Введите маску"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <table className="dishes-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Название</th>
//             <th>Цена</th>
//             <th>Калорийность</th>
//             <th>Состав</th>
//             <th>Вид кухни</th>
//             <th>Тип блюда</th>
//             <th>Описание</th>
//             <th>Действия</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredDishes.map((dish) => (
//             <tr key={dish.id}>
//               <td>{dish.id}</td>
//               <td>
//                 {isEditing === dish.id ? (
//                   <input
//                     type="text"
//                     value={dish.name}
//                     onChange={(e) => handleInputChange(dish.id, "name", e.target.value)}
//                   />
//                 ) : (
//                   dish.name
//                 )}
//               </td>
//               <td>
//                 {isEditing === dish.id ? (
//                   <input
//                     type="number"
//                     value={dish.price}
//                     onChange={(e) => handleInputChange(dish.id, "price", e.target.value)}
//                   />
//                 ) : (
//                   `${dish.price} ₽`
//                 )}
//               </td>
//               <td>{dish.calories}</td>
//               <td>{dish.ingredients.map((ing) => ing.name).join(", ")}</td>
//               <td>{dish.cuisine}</td>
//               <td>{dish.type}</td>
//               <td>{dish.description}</td>
//               <td>
//                 {isEditing === dish.id ? (
//                   <>
//                     <button onClick={() => handleSaveDish(dish.id)}>✔</button>
//                     <button onClick={handleCancelEdit}>✖</button>
//                   </>
//                 ) : (
//                   <>
//                     <button onClick={() => handleEditDish(dish.id)}>✏</button>
//                     <button onClick={() => handleDelete(dish.id)}>❌</button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="add-dish-form">
//         <h3>Добавить новое блюдо</h3>
//         <input
//           type="text"
//           placeholder="Название"
//           value={newDish.name}
//           onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
//         />
//         <input
//           type="number"
//           placeholder="Цена"
//           value={newDish.price}
//           onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Калории"
//           value={newDish.calories}
//           onChange={(e) => setNewDish({ ...newDish, calories: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Состав (через запятую)"
//           value={newDish.ingredients}
//           onChange={(e) => setNewDish({ ...newDish, ingredients: e.target.value })}
//         />
//         <button onClick={handleAddDish}>Добавить</button>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;