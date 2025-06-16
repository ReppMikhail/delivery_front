import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import Profile from "./pages/Profile";
import CartPage from "./pages/CartPage";
import ManagerPage from "./pages/ManagerPage";
import CourierPage from "./pages/CourierPage";
import AdminPage from "./pages/admin/AdminPage";
import Clients from "./pages/admin/Clients";
import Couriers from "./pages/admin/Couriers";
import Managers from "./pages/admin/Managers";
import Orders from "./pages/admin/Orders";
import Directory from "./pages/admin/Directory";
import Ingridients from "./pages/admin/Ingridients";
import AdminProfile from "./pages/admin/AdminProfile";
import ManagerProfile from "./pages/ManagerProfile";
import CourierProfile from "./pages/CourierProfile";
import AboutSystem from "./pages/AboutSystem"; // Импорт компонента "О системе"
import AboutDevelopers from "./pages/AboutDevelopers"; // Импорт компонента "О разработчиках"
import { jwtDecode } from "jwt-decode";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));

    if (authData && authData.accessToken) {
      try {
        const decodedToken = jwtDecode(authData.accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          console.log("Токен истёк. Требуется повторная авторизация.");
          localStorage.removeItem("authData");
          navigate("/");
        } else {
          // Перенаправление в зависимости от роли
          if (decodedToken.role === "manager") {
            navigate("/manager");
          } else if (decodedToken.role === "courier") {
            navigate("/courier");
          } else if (decodedToken.role === "admin") {
            navigate("/admin");
          } else if (decodedToken.role === "customer") {
            navigate("/main");
          }
        }
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
        localStorage.removeItem("authData");
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Новые маршруты */}
      <Route path="/about/system" element={<AboutSystem />} />
      <Route path="/about/developers" element={<AboutDevelopers />} />

      <Route path="/admin" element={<ProtectedRoute role="ROLE_ADMIN"><AdminPage /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute role="ROLE_ADMIN"><Clients /></ProtectedRoute>} />
      <Route path="/couriers" element={<ProtectedRoute role="ROLE_ADMIN"><Couriers /></ProtectedRoute>} />
      <Route path="/managers" element={<ProtectedRoute role="ROLE_ADMIN"><Managers /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="ROLE_ADMIN"><Orders /></ProtectedRoute>} />
      <Route path="/directory" element={<ProtectedRoute role="ROLE_ADMIN"><Directory /></ProtectedRoute>} />
      <Route path="/ingridients" element={<ProtectedRoute role="ROLE_ADMIN"><Ingridients /></ProtectedRoute>} />
      <Route path="/adminProfile" element={<ProtectedRoute role="ROLE_ADMIN"><AdminProfile /></ProtectedRoute>} />

      <Route path="/manager" element={<ProtectedRoute role="ROLE_MANAGER"><ManagerPage /></ProtectedRoute>} />
      <Route path="/courier" element={<ProtectedRoute role="ROLE_COURIER"><CourierPage /></ProtectedRoute>} />
      <Route path="/manager-profile" element={<ProtectedRoute role="ROLE_MANAGER"><ManagerProfile /></ProtectedRoute>} />
      <Route path="/courier-profile" element={<ProtectedRoute role="ROLE_COURIER"><CourierProfile /></ProtectedRoute>} />


      <Route path="/main" element={<ProtectedRoute role="ROLE_CUSTOMER"><MainPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute role="ROLE_CUSTOMER"><Profile /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute role="ROLE_CUSTOMER"><CartPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;