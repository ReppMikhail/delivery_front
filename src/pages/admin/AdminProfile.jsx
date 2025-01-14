import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  getAllCouriers,
  getAllCustomers,
  getAllManagers,
  updateUser,
} from "../../http/adminService";
import NavigationBar from "../../components/NavigationBar";

const AdminProfilePage = () => {
  const [adminUsername, setAdminUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const adminId = authData?.id;

    const fetchAdminData = async () => {
      try {
        const adminData = await getUserById(adminId);
        setAdminUsername(adminData.username);
        setNewUsername(adminData.username); // Инициализация поля ввода
      } catch (error) {
        console.error("Ошибка при получении данных администратора:", error);
        alert("Не удалось загрузить данные администратора. Выполните повторный вход.");
        navigate("/"); // Перенаправление на страницу входа при ошибке
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleSaveUsername = async () => {
    try {
      setIsSaving(true);

      // Загружаем всех пользователей
      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);

      const allUsers = [...customers, ...managers, ...couriers];

      // Проверяем уникальность логина
      const isUsernameTaken = allUsers.some(
        (user) => user.username === newUsername
      );

      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        setIsSaving(false);
        return;
      }

      // Сохраняем новый логин
      const authData = JSON.parse(localStorage.getItem("authData"));
      const adminId = authData?.id;

      await updateUser(adminId, { username: newUsername });

      // Обновляем данные авторизации в localStorage
      const updatedAuthData = { ...authData, username: newUsername };
      localStorage.setItem("authData", JSON.stringify(updatedAuthData));

      // Удаляем токен и перенаправляем на страницу авторизации
      localStorage.removeItem("authData");
      alert("Логин успешно обновлен! Выполните вход с новым логином.");
      navigate("/");
    } catch (error) {
      console.error("Ошибка при сохранении нового логина:", error);
      alert("Ошибка при сохранении нового логина.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ padding: "20px" }}>
        <h1>Профиль администратора</h1>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username">Логин администратора: </label>
          <input
            id="username"
            type="text"
            value={newUsername}
            disabled={!isEditing}
            onChange={(e) => setNewUsername(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
          {isEditing ? (
            <button
              onClick={handleSaveUsername}
              disabled={isSaving}
              style={{ marginLeft: "10px" }}
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{ marginLeft: "10px" }}
            >
              Изменить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
