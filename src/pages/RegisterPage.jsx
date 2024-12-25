import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../http/authService";

function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== passwordConfirmation) {
      alert("Пароли не совпадают!");
      return;
    }

    try {
      const userData = {
        name,
        phone,
        username,
        address,
        password,
        passwordConfirmation,
      };

      const response = await registerUser(userData); // Вызов функции регистрации
      console.log("Пользователь зарегистрирован:", response);
      alert("Регистрация успешна!");
      navigate("/main"); // Перенаправление на главную
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
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>📞</span>
          <input
            type="tel"
            placeholder="Введите Телефон"
            style={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>📧</span>
          <input
            type="email"
            placeholder="Введите Email"
            style={styles.input}
            value={username}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🏠</span>
          <input
            type="text"
            placeholder="Введите Адрес"
            style={styles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Введите пароль"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Повторите пароль"
            style={styles.input}
            value={passwordConfirmation}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div style={styles.footer}>
          <button style={styles.loginLink} onClick={goToLogin}>
            Уже есть аккаунт?
          </button>
          <button style={styles.registerButton} onClick={handleRegister}>
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
};

export default RegisterPage;
