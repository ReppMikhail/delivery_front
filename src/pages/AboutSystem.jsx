import React from "react";
import { jwtDecode } from "jwt-decode";
import NavigationBar from "../components/NavigationBar";

const AboutSystem = () => {

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

  return (
    <div>
      <NavigationBar />
      <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", margin: "0 auto", maxWidth: "900px", padding: "20px" }}>

        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px", marginTop: "0" }}>О системе</h1>
        
        {isCustomer && (
          <div>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px", marginTop: "40px" }}>Вы - клиент</h2>
            <p style={{ marginBottom: "20px"}}>
            При авторизации под аккаунтом клиента пользователь переходит на страницу клиента, с открытым разделом "Главная" по умолчанию.
            </p>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img 
                src="/public/images/CustomerMain.png" 
                alt="Главная страница клиента" 
                style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
              />
            </div>
            <p style={{ marginBottom: "20px"}}>
              На главной странице клиент видит карточки блюд, сгруппированные по категориям. Клиент может открыть карточку блюда, добавить блюдо в корзину.
             В навигационной панели у пользователя есть кнопки для возврата на главную страницу, переход к разделу "О нас", перехода в личный кабинет,
              перехода в корзину и выхода из системы. Ниже навигационной панели располагается панель управления блюдами, где пользователь может выбрать категорию
              блюд, осуществить переход к блоку этих блюд на странице, выполнить фильтрацию по цене, ингредиентам и кухням, осуществить сортировку по цене и весу,
              а также выполнить поиск блюд по названию.
            </p>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
              src="/public/images/CustomerProfile.png" 
              alt="Личный кабинет клиента" 
              style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
              />
            </div>

            <p style={{ marginBottom: "20px"}}>
             В личном кабинете клиента отображается основная информация о нём, его текущие заказы и история заказов.
            </p>

            <p style={{ marginBottom: "20px"}}>
              В корзине клиента отображаются все блюда, которые он добавил в корзину. Там пользователь может управлять количеством этих блюд в корзине, а также
              оформить заказ.
            </p>
          </div>
        )}


        {isCourier && (
          
          <div>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px", marginTop: "40px" }}>Вы - курьер</h2>

        <p style={{ marginBottom: "20px"}}>
          При авторизации под аккаунтом курьера пользователю открывается главная страница курьера.
        </p>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img 
            src="/public/images/CourierMain.png" 
            alt="Главная страница курьера" 
            style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
        </div>

        <p style={{ marginBottom: "20px"}}>
          На ней у курьера отображаются карточки заказов, назначенные ему, если он не находится в доставке, и карточки заказов, которые он доставляет
          в данный момент. В этих карточках отображается основная информация о заказах и кнопки для управления их состоянием.
        </p>

        <p style={{ marginBottom: "20px"}}>
          В навигационной панели курьера есть кнопки для перехода на страницу с заказами, информацию "О нас", завершения смены, перехода
          в личный кабинет, где отображается основная информация о курьере, и выхода из системы.
        </p>
          </div>

        )}
        


        {isManager && (
          
          <div>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px", marginTop: "40px" }}>Вы - менеджер</h2>

        <p style={{ marginBottom: "20px"}}>
          При авторизации под аккаунтом менеджера пользователю открывается главная страница менеджера.
        </p>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img 
            src="/public/images/ManagerMain.png" 
            alt="Главная страница менеджера" 
            style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
        </div>

        <p style={{ marginBottom: "20px"}}>
          На ней отображаются карточки заказов с их статусом и информацией, а также карточки курьеров с их статусом и основной информацией. 
          Менеджер может управлять статусами заказов, назначать заказы курьерам и начинать их доставку.
        </p>

        <p style={{ marginBottom: "20px"}}>
          В навигационной панели есть кнопки для перехода на главную страницу, раздел "О нас", личный кабинет с основной информацией о менеджере, а также 
          для переключения режимов просмотра заказов - все заказы или только активные.
        </p>
          </div>

        )}




        {isAdmin && (
          
          <div>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px", marginTop: "40px" }}>Вы - администратор</h2>

        <p style={{ marginBottom: "20px"}}>
          При авторизации под аккаунтом администратора пользователю открывается главная страница, где можно управлять блюдами.
        </p>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img 
            src="/public/images/AdminMain.png" 
            alt="Главная страница администратора" 
            style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
        </div>

        <p style={{ marginBottom: "20px"}}>
          На этой странице отображаются карточки блюд с основной информацией и кнопками для добавления, редактирования и удаления блюд. Также можно
          открыть модальное окно для ввода информации при добавлении или редактировании блюда.
        </p>

        <p style={{ marginBottom: "20px"}}>
          В навигационной панели администратора расположены кнопки для перехода на страницы с таблицами базы данных. Каждая страница позволяет добавлять,
          редактировать и удалять соответствующие сущности. Также есть кнопки для перехода на страницу просмотра заказов, справочник, личный кабинет для
          изменения логина, выход из системы, и раздел "О нас".
        </p>
          </div>

        )}
        

        
      </div>
    </div>
  );
};

export default AboutSystem;
