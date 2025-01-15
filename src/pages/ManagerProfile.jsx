import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllManagers, getAllCustomers, getAllCouriers, getUserById } from "../http/adminService";
import "./Profile.css";
import ValidationHelper from "../components/ValidationHelper"; // Импорт валидации
import NavigationBar from "../components/NavigationBar";

const ManagerProfile = () => {
  const navigate = useNavigate();
  const [managerData, setManagerData] = useState({});
  const [originalManagerData, setOriginalManagerData] = useState({});
  const [isFieldChanged, setIsFieldChanged] = useState({});
  const [isAnyFieldChanged, setIsAnyFieldChanged] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const managerId = authData?.id;

    if (!managerId) {
      console.error("Менеджер не авторизован");
      navigate("/");
      return;
    }

    const fetchManagerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/${managerId}/no-orders`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );
        const manager = response.data;
        const formattedData = {
          id: manager.id,
          fullName: manager.name,
          phone: manager.phone,
          email: manager.username,
          address: manager.address,
        };
        setManagerData(formattedData);
        setOriginalManagerData(formattedData);
      } catch (error) {
        console.error("Ошибка при загрузке данных менеджера:", error);
      }
    };

    fetchManagerData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...managerData, [name]: value };
    setManagerData(updatedData);

    const hasChanged = updatedData[name] !== originalManagerData[name];
    const updatedFieldState = { ...isFieldChanged, [name]: hasChanged };
    setIsFieldChanged(updatedFieldState);

    const changedFields = Object.values(updatedFieldState).filter(Boolean);
    setIsAnyFieldChanged(changedFields.length > 1);

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case "fullName":
        error = ValidationHelper.validateName(value);
        break;
      case "phone":
        error = ValidationHelper.validatePhone(value);
        break;
      case "email":
        error = ValidationHelper.validateEmail(value);
        break;
      case "address":
        error = ValidationHelper.validateAddress(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSave = async () => {
    const newErrors = {};
    Object.keys(managerData).forEach((field) => {
      const error = validateField(field, managerData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const { id } = managerData;

      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);
      const adminUser = getUserById(1);
      const allUsers = [...customers, ...managers, ...couriers, adminUser];

      const isUsernameTaken = allUsers.some(
        (user) => user.username === managerData.email && user.id !== id
      );

      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        return;
      }

      const updatedData = {
        name: managerData.fullName,
        username: managerData.email,
        phone: managerData.phone,
        address: managerData.address,
      };

      await axios.put(`http://localhost:8080/api/v1/users/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      });

      console.log("Данные успешно обновлены");

      if (managerData.email !== originalManagerData.email) {
        localStorage.removeItem("authData");
        alert("Логин успешно обновлен! Выполните вход с новым логином.");
        navigate("/");
      } else {
        setOriginalManagerData({ ...managerData });
        setIsFieldChanged({});
        setIsAnyFieldChanged(false);
      }
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  return (
    <div className="profile-page">
      <NavigationBar />
      <h1>Профиль менеджера</h1>
      <div className="profile-container">
        <div className="profile-data">
          <h2>ФИО</h2>
          <input
            type="text"
            name="fullName"
            value={managerData.fullName}
            onChange={handleInputChange}
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          {isFieldChanged.fullName && !isAnyFieldChanged && !errors.fullName && (
            <button onClick={handleSave}>Сохранить</button>
          )}

          <h2>Телефон</h2>
          <input
            type="text"
            name="phone"
            value={managerData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
          {isFieldChanged.phone && !isAnyFieldChanged && !errors.phone && (
            <button onClick={handleSave}>Сохранить</button>
          )}

          <h2>E-mail</h2>
          <input
            type="email"
            name="email"
            value={managerData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          {isFieldChanged.email && !isAnyFieldChanged && !errors.email && (
            <button onClick={handleSave}>Сохранить</button>
          )}

          <h2>Адрес</h2>
          <input
            type="text"
            name="address"
            value={managerData.address}
            onChange={handleInputChange}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
          {isFieldChanged.address && !isAnyFieldChanged && !errors.address && (
            <button onClick={handleSave}>Сохранить</button>
          )}
        </div>
      </div>
      {isAnyFieldChanged && (
            <button className="save-all-button" onClick={handleSave} style={styles.saveallbutton}>
              Сохранить изменения
            </button>
          )}
    </div>
  );
};

const styles = {
    saveallbutton: {
        marginLeft: "50px",
    },
};

export default ManagerProfile;
