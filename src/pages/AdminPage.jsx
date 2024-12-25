// AdminPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [dishes, setDishes] = useState([
      {
        id: 1,
        name: "Салат \"Цезарь\"",
        price: 827,
        calories: "350 ккал",
        ingredients: "Помидоры, сухарики, курица, салат айсберг, соус Цезарь",
        cuisine: "Итальянская",
        type: "Закуска",
        description: "Блюдо из свежей зелени, куриного филе и нежного соуса."
      },
      {
        id: 2,
        name: "Том Ям",
        price: 827,
        calories: "350 ккал",
        ingredients: "Помидоры, шампиньоны, курица, креветки",
        cuisine: "Тайская",
        type: "Суп",
        description: "Острый суп с креветками на кокосовом молоке."
      },
    ]);
  
    const [editingId, setEditingId] = useState(null);
    const [newDish, setNewDish] = useState({
      id: "",
      name: "",
      price: "",
      calories: "",
      ingredients: "",
      cuisine: "",
      type: "",
      description: "",
    });
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const filteredDishes = dishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const handleAddDish = () => {
      setNewDish({
        id: dishes.length + 1,
        name: "",
        price: "",
        calories: "",
        ingredients: "",
        cuisine: "",
        type: "",
        description: "",
      });
      setEditingId("new");
    };
  
    const handleEditDish = (id) => {
      setEditingId(id);
      setNewDish(dishes.find((dish) => dish.id === id));
    };
  
    const handleDeleteDish = (id) => {
      setDishes(dishes.filter((dish) => dish.id !== id));
    };
  
    const handleSaveDish = () => {
      if (editingId === "new") {
        setDishes([...dishes, newDish]);
      } else {
        setDishes(
          dishes.map((dish) => (dish.id === editingId ? newDish : dish))
        );
      }
      setEditingId(null);
    };
  
    const handleCancelEdit = () => {
      setEditingId(null);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewDish({ ...newDish, [name]: value });
    };
  
    return (
      <div className="admin-page">
        <header className="admin-navbar">
          <button>Самара</button>
          <button>Блюда</button>
          <button>Клиенты</button>
          <button>Менеджеры</button>
          <button>Курьеры</button>
          <button>Заказы</button>
        </header>
  
        <div className="admin-container">
          <h2>Блюда</h2>
          <div className="admin-controls">
            <button onClick={handleAddDish} className="add-button">Добавить</button>
            <input
              type="text"
              placeholder="Введите маску"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
  
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Калорийность</th>
                <th>Состав</th>
                <th>Вид кухни</th>
                <th>Тип блюда</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredDishes.map((dish) => (
                <tr key={dish.id}>
                  <td>{dish.id}</td>
                  <td>{editingId === dish.id ? (
                    <input
                      name="name"
                      value={newDish.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    dish.name
                  )}</td>
                  <td>{editingId === dish.id ? (
                    <input
                      name="price"
                      value={newDish.price}
                      onChange={handleInputChange}
                    />
                  ) : (
                    dish.price
                  )}</td>
                  <td>{editingId === dish.id ? (
                    <input
                      name="calories"
                      value={newDish.calories}
                      onChange={handleInputChange}
                    />
                  ) : (
                    dish.calories
                  )}</td>
                  <td>{editingId === dish.id ? (
                    <input
                      name="ingredients"
                      value={newDish.ingredients}
                      onChange={handleInputChange}
                    />
                  ) : (
                    dish.ingredients
                  )}</td>
                  <td>{editingId === dish.id ? (
                    <input
                      name="cuisine"
                      value={newDish.cuisine}
                      onChange={handleInputChange}
                    />
                  ) : (
                    dish.cuisine
                  )}</td>
                  <td>{editingId === dish.id ? (
                    <input
                      name="type"
                      value={newDish.type}
                      onChange={handleInputChange}
                    />
                  ) : (
                    dish.type
                  )}</td>
                  <td>{editingId === dish.id ? (
                    <input
                      name="description"
                      value={newDish.description}
                      onChange={handleInputChange}
                    />
                  ) : (
                    dish.description
                  )}</td>
                  <td>
                    {editingId === dish.id ? (
                      <>
                        <button onClick={handleSaveDish}>✔</button>
                        <button onClick={handleCancelEdit}>✖</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditDish(dish.id)}>✎</button>
                        <button onClick={() => handleDeleteDish(dish.id)}>✖</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
  
              {editingId === "new" && (
                <tr>
                  <td>New</td>
                  <td><input name="name" value={newDish.name} onChange={handleInputChange} /></td>
                  <td><input name="price" value={newDish.price} onChange={handleInputChange} /></td>
                  <td><input name="calories" value={newDish.calories} onChange={handleInputChange} /></td>
                  <td><input name="ingredients" value={newDish.ingredients} onChange={handleInputChange} /></td>
                  <td><input name="cuisine" value={newDish.cuisine} onChange={handleInputChange} /></td>
                  <td><input name="type" value={newDish.type} onChange={handleInputChange} /></td>
                  <td><input name="description" value={newDish.description} onChange={handleInputChange} /></td>
                  <td>
                    <button onClick={handleSaveDish}>✔</button>
                    <button onClick={handleCancelEdit}>✖</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default AdminPage;

// const AdminPage = () => {
//   const navigate = useNavigate();
//   const [dishes, setDishes] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isEditing, setIsEditing] = useState(null);
//   const [newDish, setNewDish] = useState({ name: "", price: "", calories: "", ingredients: "", cuisine: "", type: "", description: "" });

//   useEffect(() => {
//     fetchDishes();
//   }, []);

//   const fetchDishes = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/v1/dishes");
//       setDishes(response.data);
//     } catch (error) {
//       console.error("Ошибка при загрузке блюд:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8080/api/v1/dishes/${id}`);
//       setDishes(dishes.filter((dish) => dish.id !== id));
//     } catch (error) {
//       console.error("Ошибка при удалении блюда:", error);
//     }
//   };

//   const handleAddDish = async () => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/v1/dishes", newDish);
//       setDishes([...dishes, response.data]);
//       setNewDish({ name: "", price: "", calories: "", ingredients: "", cuisine: "", type: "", description: "" });
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
//       await axios.put(`http://localhost:8080/api/v1/dishes/${id}`, updatedDish);
//       setIsEditing(null);
//     } catch (error) {
//       console.error("Ошибка при сохранении блюда:", error);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(null);
//     fetchDishes(); // Обновляем список блюд после отмены
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
//       {/* Навигационная панель */}
//       <header className="navbar">
//         <div className="navbar-left">
//           <button onClick={() => navigate("/dishes")}>Блюда</button>
//           <button onClick={() => navigate("/clients")}>Клиенты</button>
//           <button onClick={() => navigate("/managers")}>Менеджеры</button>
//           <button onClick={() => navigate("/couriers")}>Курьеры</button>
//           <button onClick={() => navigate("/orders")}>Заказы</button>
//         </div>
//       </header>

//       {/* Поиск */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Введите маску"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Таблица блюд */}
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
//               <td>{dish.ingredients}</td>
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

//       {/* Форма для добавления нового блюда */}
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
//         <button onClick={handleAddDish}>Добавить</button>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;
