import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Исправлено: jwtDecode используется без деструктуризации
import PropTypes from "prop-types";
import "./NavigationBar.css";

const NavigationBar = ({
  courierStatus,
  handleEndShift,
  showOnlyActiveOrders,
  setShowOnlyActiveOrders, // Новый проп для управления переключателем
}) => {
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
  const isManager = roles.includes("ROLE_MANAGER");
  const isAdmin = roles.includes("ROLE_ADMIN");

  if (isCourier) {
    return (
      <header className="navbar">
        <div className="navbar-left">
          <span>Вкус есть</span>
          <button onClick={() => navigate("/courier")}>Заказы</button>
          <div
            className="dropdown-container"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button className="dropdown-button">О нас</button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/about/system")}>
                  О системе
                </button>
                <button onClick={() => navigate("/about/developers")}>
                  О разработчике
                </button>
              </div>
            )}
          </div>
          
        </div>
        <div className="navbar-right">
          {courierStatus?.onShift && (
            <button className="end-shift-button" onClick={handleEndShift}>
              Закончить смену
            </button>
          )}
          <button onClick={() => navigate("/courier-profile")}>Личный кабинет</button>
          <button
            onClick={() => {
              localStorage.clear(); // Очищает local storage
              navigate("/"); // Перенаправляет на главную страницу
            }}
          >
            Выйти
          </button>
        </div>
      </header>
    );
  }

  if (isManager) {
    return (
      <header className="navbar">
        <div className="navbar-left">
          <span>Вкус есть</span>
          <button onClick={() => navigate("/manager")}>Заказы</button>
          <div
            className="dropdown-container"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button className="dropdown-button">О нас</button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/about/system")}>
                  О системе
                </button>
                <button onClick={() => navigate("/about/developers")}>
                  О разработчике
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="navbar-right">
        <button onClick={() => navigate("/manager-profile")}>Личный кабинет</button>
          <div className="manager-toggle-switch">
            <label className="manager-switch">
              <input
                type="checkbox"
                checked={showOnlyActiveOrders}
                onChange={() => setShowOnlyActiveOrders(!showOnlyActiveOrders)}
              />
              <span className="manager-slider round"></span>
            </label>
            <span className="manager-toggle-label">
              Показать только активные заказы
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.clear(); // Очищает local storage
              navigate("/"); // Перенаправляет на главную страницу
            }}
          >
            Выйти
          </button>
        </div>
      </header>
    );
  }

  if (isCustomer) {
    return (
      <header className="navbar">
        <div className="navbar-left">
          <span>Вкус есть</span>
          <button onClick={() => navigate("/main")}>Главная</button>
          <div
            className="dropdown-container"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button className="dropdown-button">О нас</button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/about/system")}>
                  О системе
                </button>
                <button onClick={() => navigate("/about/developers")}>
                  О разработчике
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/profile")}>Личный кабинет</button>
          <button onClick={() => navigate("/cart")}>Корзина</button>
          <button
            onClick={() => {
              localStorage.clear(); // Очищает local storage
              navigate("/"); // Перенаправляет на главную страницу
            }}
          >
            Выйти
          </button>
        </div>
      </header>
    );
  }

  if (isAdmin) {
    return (
      <header className="navbar">
        <div className="navbar-left">
          <span>Вкус есть</span>
          <button onClick={() => navigate("/admin")}>Блюда</button>
          <button onClick={() => navigate("/clients")}>Клиенты</button>
          <button onClick={() => navigate("/managers")}>Менеджеры</button>
          <button onClick={() => navigate("/couriers")}>Курьеры</button>
          <button onClick={() => navigate("/orders")}>Заказы</button>
          <button onClick={() => navigate("/directory")}>Справочник</button>
          <button onClick={() => navigate("/ingridients")}>Ингредиенты</button>
        </div>
        <div className="navbar-right">
        <button onClick={() => navigate("/adminProfile")}>Личный кабинет</button>
          <div
            className="dropdown-container"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button className="dropdown-button">О нас</button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/about/system")}>
                  О системе
                </button>
                <button onClick={() => navigate("/about/developers")}>
                  О разработчике
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              localStorage.clear(); // Очищает local storage
              navigate("/"); // Перенаправляет на главную страницу
            }}
          >
            Выйти
          </button>
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
