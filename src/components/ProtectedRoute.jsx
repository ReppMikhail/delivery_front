import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
    const authData = JSON.parse(localStorage.getItem("authData"));
  
    if (!authData || !authData.accessToken) {
      return <Navigate to="/" />;
    }
  
    try {
      const decodedToken = jwtDecode(authData.accessToken);
  
      // Проверка роли
      if (!decodedToken.roles || !decodedToken.roles.includes(role)) {
        return <Navigate to="/" />;
      }
  
      // Проверка срока действия токена
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        alert("Срок действия вашей сессии истёк. Пожалуйста, войдите снова.");
        localStorage.removeItem("authData");
        return <Navigate to="/" />;
      }
    } catch (error) {
      console.error("Ошибка проверки токена:", error);
      localStorage.removeItem("authData");
      return <Navigate to="/" />;
    }
  
    return children;
  };

export default ProtectedRoute;


// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, role }) => {
//   const user = JSON.parse(localStorage.getItem("user")); // Получаем данные пользователя

//   if (!user) {
//     return <Navigate to="/login" replace />; // Если пользователь не авторизован, перенаправляем
//   }

//   if (role && user.role !== role) {
//     return <Navigate to="/" replace />; // Если роль не совпадает, перенаправляем
//   }

//   return children; // Если всё в порядке, рендерим дочерние элементы
// };

// export default ProtectedRoute;
