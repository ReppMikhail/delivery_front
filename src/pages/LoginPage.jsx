import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { loginUser } from "../http/authService";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (login && password) {
      try {
        const userData = { username: login, password };
        const response = await loginUser(userData);
  
        console.log("Успешный вход:", response);
  
        // Сохранение данных в localStorage
        const { id, accessToken, refreshToken } = response;
        localStorage.setItem("authData", JSON.stringify({ id, accessToken, refreshToken }));
  
        // Декодирование токена для получения роли
        const decodedToken = jwtDecode(accessToken);
        const roles = decodedToken.roles; // массив ролей из токена
  
        console.log("Роль пользователя:", roles);
  
        // Перенаправление в зависимости от роли
        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else if (roles.includes("ROLE_MANAGER")) {
          navigate("/manager");
        } else if (roles.includes("ROLE_COURIER")) {
          navigate("/courier");
        } else if (roles.includes("ROLE_CUSTOMER")) {
            navigate("/main");
        } else {
          console.error("Неизвестная роль");
          alert("Ошибка: неизвестная роль пользователя.");
        }
      } catch (error) {
        console.error("Ошибка авторизации:", error);
        alert(error.message || "Ошибка входа. Проверьте логин и пароль.");
      }
    } else {
      alert("Введите логин и пароль!");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Авторизация</h2>
      <div style={styles.form}>
        {/* Поле для ввода логина */}
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>👤</span>
          <input
            type="email"
            placeholder="Введите ваш логин"
            style={styles.input}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>

        {/* Поле для ввода пароля */}
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Введите ваш пароль"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Нижняя часть формы */}
        <div style={styles.footer}>
          <button style={styles.registerLink} onClick={goToRegister}>
            Ещё нет аккаунта?
          </button>
          <button style={styles.loginButton} onClick={handleLogin}>
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
  registerLink: {
    background: "none",
    border: "none",
    color: "#4a4a4a",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
    fontFamily: "'Roboto', sans-serif",
  },
  loginButton: {
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

export default LoginPage;


// const LoginPage = () => {
//   const [credentials, setCredentials] = useState({
//     username: "courier",
//     password: "password",
//   });

//   const [error, setError] = useState("");
//   const [token, setToken] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials({
//       ...credentials,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       const response = await loginUser(credentials);
//       console.log("Успешный вход:", response);
//       setToken(response.token); // Предположим, что backend возвращает токен
//     } catch (error) {
//       console.error("Ошибка авторизации:", error.response?.data || error.message);
//       setError("Неверные логин или пароль.");
//     }
//   };

//   return (
//     <div>
//       <h2>Авторизация</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Логин (email):</label>
//           <input
//             type="text"
//             name="username"
//             value={credentials.username}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Пароль:</label>
//           <input
//             type="password"
//             name="password"
//             value={credentials.password}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <button type="submit">Войти</button>
//       </form>
//       {token && <p>Ваш токен: {token}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// };

// export default LoginPage;