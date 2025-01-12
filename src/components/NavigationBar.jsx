import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Исправлено: jwtDecode используется без деструктуризации
import PropTypes from "prop-types";
import "./NavigationBar.css";

const NavigationBar = ({ courierStatus, handleEndShift }) => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const authData = JSON.parse(localStorage.getItem("authData"));
  let roles = [];

  if (authData?.accessToken) {
    try {
      const decodedToken = jwtDecode(authData.accessToken);
      roles = decodedToken.roles || [];
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
    }
  }

  const isCustomer = roles.includes("ROLE_CUSTOMER");
  const isCourier = roles.includes("ROLE_COURIER");

  if (isCourier) {
    return (
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/courier")}>Заказы</button>
          <div
            className="dropdown-container"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button className="dropdown-button">О нас</button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/about/system")}>О системе</button>
                <button onClick={() => navigate("/about/developers")}>О разработчиках</button>
              </div>
            )}
          </div>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          {courierStatus?.onShift && (
            <button className="end-shift-button" onClick={handleEndShift}>
              Закончить смену
            </button>
          )}
        </div>
      </header>
    );
  }

  if (isCustomer) {
    return (
      <header className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/main")}>Главная</button>
          <div
            className="dropdown-container"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button className="dropdown-button">О нас</button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/about/system")}>О системе</button>
                <button onClick={() => navigate("/about/developers")}>О разработчиках</button>
              </div>
            )}
          </div>
          <span>+7 937 123 98 56</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/profile")}>Личный кабинет</button>
          <button onClick={() => navigate("/cart")}>Корзина</button>
        </div>
      </header>
    );
  }

  return null; // Для других ролей панель пустая
};

NavigationBar.propTypes = {
  courierStatus: PropTypes.shape({
    onShift: PropTypes.bool,
  }),
  handleEndShift: PropTypes.func,
};

export default NavigationBar;
