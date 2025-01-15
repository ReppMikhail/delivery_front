import React from "react";
import NavigationBar from "../components/NavigationBar";

const AboutDevelopers = () => {
  return (
    <div>
      <NavigationBar />
      <h1 style={{ textAlign: "center" }}>Сведения о разработчиках</h1>
      <div style={{ textAlign: "center", lineHeight: "1.8" }}>
        <p>Самарский университет</p>
        <p>Кафедра программных систем</p>
        <p>Курсовой проект по дисциплине "Программная инженерия"</p>
        <p>Тема проекта: "Приложение для удаленного создания	
	заказов в системе ресторана и контроля их исполнения"
</p>
        <br />
        <p>
          Разработчики - обучающиеся группы 6401-020302D:
          <br />
          А.А. Алёнушка
          <br />
          М.А. Репп
          <br />
          К.А. Садовников
        </p>
        <br />
        <p>Самара 2024</p>
      </div>
    </div>
  );
};

export default AboutDevelopers;
