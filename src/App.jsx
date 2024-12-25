import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
//import MainPage from "./pages/MainPage";
import CartPage from "./pages/CartPage";
import ManagerPage from "./pages/ManagerPage";
import CourierPage from "./pages/CourierPage";
import AdminPage from "./pages/AdminPage";
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
      <Route path="/main" element={<MainPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/manager" element={<ProtectedRoute role="ROLE_MANAGER"><ManagerPage /></ProtectedRoute>} />
      <Route path="/courier" element={<ProtectedRoute role="ROLE_COURIER"><CourierPage /></ProtectedRoute>} />
      {/* <Route path="/admin" element={<ProtectedRoute role="ROLE_ADMIN"><AdminPage /></ProtectedRoute>} /> */}
    </Routes>
  );
}

export default App;

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/main" element={<MainPage />} />
//         <Route path="/manager" element={ <ProtectedRoute role="manager"> <ManagerPage /> </ProtectedRoute>}/>
//         <Route path="/courier" element={ <ProtectedRoute role="courier"> <CourierPage /> </ProtectedRoute>}/>
//         {/* <Route path="/cart" element={<CartPage />} />
//         <Route path="/profile" element={<ProfilePage />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;