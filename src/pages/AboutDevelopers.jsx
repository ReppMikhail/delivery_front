import React from "react";
import NavigationBar from "../components/NavigationBar";

const AboutDevelopers = () => {
  return (
    <div>
      <NavigationBar />
      <h1 style={{ textAlign: "center" }}>Сведения о разработчике</h1>
      <div style={{ textAlign: "center", lineHeight: "1.8" }}>
        <p>Самарский университет</p>
        <p>Кафедра программных систем</p>
        <p>«Веб-приложение для управления заказами в ресторане «Вкус есть» и удалённого мониторинга их выполнения в режиме реального времени»</p>
        <br/>
        <p>
          Разработчик - обучающийся группы 6401-020302D:
          <br />
          М.А. Репп
          <br />
        </p>
        <br />
        <p>Самара 2025</p>
      </div>
    </div>
  );
};

export default AboutDevelopers;
