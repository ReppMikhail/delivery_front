// AdminPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../http/adminService";
import "./AdminPage.css";

const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dishes, setDishes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    calories: "",
    ingredients: "",
    cuisine: "",
    type: "",
    description: "",
  });

  useEffect(() => {
    // Fetch the dishes from the backend
    const fetchDishes = async () => {
      try {
        const data = await getAllMenuItems();
        const formattedDishes = data.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          calories: `${item.calories} ккал`,
          ingredients: item.ingredients.map((ing) => ing.name).join(", "),
          cuisine: item.category,
          type: item.category,
          description: item.description,
        }));
        setDishes(formattedDishes);
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
      }
    };
    fetchDishes();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDish = () => {
    setNewDish({
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

  const handleDeleteDish = async (id) => {
    try {
      await deleteMenuItem(id);
      setDishes(dishes.filter((dish) => dish.id !== id));
    } catch (error) {
      console.error("Failed to delete dish:", error);
    }
  };

  const handleSaveDish = async () => {
    try {
      if (editingId === "new") {
        const createdDish = await createMenuItem(newDish);
        setDishes([...dishes, createdDish]);
      } else {
        const updatedDish = await updateMenuItem(editingId, newDish);
        setDishes(dishes.map((dish) => (dish.id === editingId ? updatedDish : dish)));
      }
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save dish:", error);
    }
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
        <button>О нас</button>
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
                  <input name="name" value={newDish.name} onChange={handleInputChange} />
                ) : (
                  dish.name
                )}</td>
                <td>{editingId === dish.id ? (
                  <input name="price" value={newDish.price} onChange={handleInputChange} />
                ) : (
                  dish.price
                )}</td>
                <td>{editingId === dish.id ? (
                  <input name="calories" value={newDish.calories} onChange={handleInputChange} />
                ) : (
                  dish.calories
                )}</td>
                <td>{editingId === dish.id ? (
                  <input name="ingredients" value={newDish.ingredients} onChange={handleInputChange} />
                ) : (
                  dish.ingredients
                )}</td>
                <td>{editingId === dish.id ? (
                  <input name="cuisine" value={newDish.cuisine} onChange={handleInputChange} />
                ) : (
                  dish.cuisine
                )}</td>
                <td>{editingId === dish.id ? (
                  <input name="type" value={newDish.type} onChange={handleInputChange} />
                ) : (
                  dish.type
                )}</td>
                <td>{editingId === dish.id ? (
                  <input name="description" value={newDish.description} onChange={handleInputChange} />
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