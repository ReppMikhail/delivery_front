import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers, getAllManagers, getAllCouriers } from "../http/adminService";
import { registerUser } from "../http/authService";
import ValidationHelper from "../components/ValidationHelper";

function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const validateField = (fieldName, value) => {
    let error = null;
    switch (fieldName) {
      case "name":
        error = ValidationHelper.validateName(value);
        break;
      case "phone":
        error = ValidationHelper.validatePhone(value);
        break;
      case "username":
        error = ValidationHelper.validateEmail(value);
        break;
      case "address":
        error = ValidationHelper.validateAddress(value);
        break;
      case "password":
        if (value.length < 8 || value.length > 16) {
          error = "Пароль должен содержать от 8 до 16 символов.";
        }
        break;
      case "passwordConfirmation":
        if (value !== password) {
          error = "Пароли не совпадают!";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateAllFields = () => {
    const validationErrors = {
      name: validateField("name", name),
      phone: validateField("phone", phone),
      username: validateField("username", username),
      address: validateField("address", address),
      password: validateField("password", password),
      passwordConfirmation: validateField("passwordConfirmation", passwordConfirmation),
    };
    setErrors(validationErrors);
    return !Object.values(validationErrors).some((error) => error);
  };

  const checkUsernameAvailability = async (newUsername) => {
    try {
      setIsSaving(true);
      const [customers, managers, couriers] = await Promise.all([
        getAllCustomers(),
        getAllManagers(),
        getAllCouriers(),
      ]);
      const allUsers = [...customers, ...managers, ...couriers];
      return allUsers.some((user) => user.username === newUsername);
    } catch (error) {
      console.error("Ошибка при проверке логина:", error.message);
      return true; // Если ошибка произошла, лучше не пропускать регистрацию
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegister = async () => {
    if (!validateAllFields()) {
      alert("Пожалуйста, исправьте ошибки в форме.");
      return;
    }

    const isUsernameTaken = await checkUsernameAvailability(username);
    if (isUsernameTaken) {
      alert("Этот логин уже занят. Выберите другой.");
      return;
    }

    try {
      const userData = { name, phone, username, address, password, passwordConfirmation };
      const response = await registerUser(userData);
      console.log("Пользователь зарегистрирован:", response);
      alert("Регистрация успешна!");
      navigate("/main");
    } catch (error) {
      console.error("Ошибка регистрации:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Ошибка регистрации. Попробуйте ещё раз.");
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Регистрация</h2>
      <div style={styles.form}>
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>👤</span>
          <input
            type="text"
            placeholder="Введите ФИО"
            style={styles.input}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: validateField("name", e.target.value) }));
            }}
          />
        </div>
        {errors.name && <p style={styles.error}>{errors.name}</p>}

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>📞</span>
          <input
            type="tel"
            placeholder="Введите Телефон"
            style={styles.input}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors((prev) => ({ ...prev, phone: validateField("phone", e.target.value) }));
            }}
          />
        </div>
        {errors.phone && <p style={styles.error}>{errors.phone}</p>}

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>📧</span>
          <input
            type="email"
            placeholder="Введите Email"
            style={styles.input}
            value={username}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, username: validateField("username", e.target.value) }));
            }}
          />
        </div>
        {errors.username && <p style={styles.error}>{errors.username}</p>}

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🏠</span>
          <input
            type="text"
            placeholder="Введите Адрес"
            style={styles.input}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setErrors((prev) => ({ ...prev, address: validateField("address", e.target.value) }));
            }}
          />
        </div>
        {errors.address && <p style={styles.error}>{errors.address}</p>}

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Введите пароль"
            style={styles.input}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: validateField("password", e.target.value) }));
            }}
          />
        </div>
        {errors.password && <p style={styles.error}>{errors.password}</p>}

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Повторите пароль"
            style={styles.input}
            value={passwordConfirmation}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                passwordConfirmation: validateField("passwordConfirmation", e.target.value),
              }));
            }}
          />
        </div>
        {errors.passwordConfirmation && <p style={styles.error}>{errors.passwordConfirmation}</p>}

        <div style={styles.footer}>
          <button style={styles.loginLink} onClick={goToLogin}>
            Уже есть аккаунт?
          </button>
          <button style={styles.registerButton} onClick={handleRegister} disabled={isSaving}>
            <span style={styles.arrow}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#4a4a4a",
    marginBottom: "20px",
    fontFamily: "'Roboto', sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "340px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    width: "100%",
    backgroundColor: "#d6fbd6",
    borderRadius: "30px",
    padding: "10px 15px",
  },
  icon: {
    fontSize: "20px",
    color: "#4a4a4a",
    marginRight: "10px",
  },
  input: {
    border: "none",
    background: "none",
    outline: "none",
    fontSize: "16px",
    width: "100%",
    color: "#4a4a4a",
    fontFamily: "'Roboto', sans-serif",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: "15px",
  },
  loginLink: {
    background: "none",
    border: "none",
    color: "#4a4a4a",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
    fontFamily: "'Roboto', sans-serif",
  },
  registerButton: {
    backgroundColor: "#00c853",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  arrow: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "-10px",
    marginBottom: "10px",
    fontFamily: "'Roboto', sans-serif",
  },
};

export default RegisterPage;
