import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllManagers, getAllCustomers, getAllCouriers, getUserById } from "../http/adminService";
import "./Profile.css";
import ValidationHelper from "../components/ValidationHelper"; // Импорт валидации
import NavigationBar from "../components/NavigationBar";

const CourierProfilePage = () => {
  const navigate = useNavigate();
  const [courierData, setCourierData] = useState({});
  const [originalCourierData, setOriginalCourierData] = useState({});
  const [isFieldChanged, setIsFieldChanged] = useState({});
  const [isAnyFieldChanged, setIsAnyFieldChanged] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const courierId = authData?.id;

    if (!courierId) {
      console.error("Курьер не авторизован");
      navigate("/");
      return;
    }

    const fetchCourierData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/${courierId}/no-orders`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );
        const courier = response.data;
        const formattedData = {
          id: courier.id,
          fullName: courier.name,
          phone: courier.phone,
          email: courier.username,
          address: courier.address,
        };
        setCourierData(formattedData);
        setOriginalCourierData(formattedData);
      } catch (error) {
        console.error("Ошибка при загрузке данных курьера:", error);
      }
    };

    fetchCourierData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...courierData, [name]: value };
    setCourierData(updatedData);

    const hasChanged = updatedData[name] !== originalCourierData[name];
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
    Object.keys(courierData).forEach((field) => {
      const error = validateField(field, courierData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const { id } = courierData;

      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);
      const adminUser = getUserById(1);
      const allUsers = [...customers, ...managers, ...couriers, adminUser];

      const isUsernameTaken = allUsers.some(
        (user) => user.username === courierData.email && user.id !== id
      );

      if (isUsernameTaken) {
        alert("Этот логин уже занят. Пожалуйста, выберите другой.");
        return;
      }

      const updatedData = {
        name: courierData.fullName,
        username: courierData.email,
        phone: courierData.phone,
        address: courierData.address,
      };

      await axios.put(`http://localhost:8080/api/v1/users/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      });

      console.log("Данные успешно обновлены");

      if (courierData.email !== originalCourierData.email) {
        localStorage.removeItem("authData");
        alert("Логин успешно обновлен! Выполните вход с новым логином.");
        navigate("/");
      } else {
        setOriginalCourierData({ ...courierData });
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
      <h1>Профиль курьера</h1>
      <div className="profile-container">
        <div className="profile-data">
          <h2>ФИО</h2>
          <input
            type="text"
            name="fullName"
            value={courierData.fullName}
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
            value={courierData.phone}
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
            value={courierData.email}
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
            value={courierData.address}
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

export default CourierProfilePage;
