import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ImageComponent = ({ id, dish, className, onClick }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!id) {
        setImageSrc(dish?.imageUrl || "https://via.placeholder.com/150");
        setLoading(false);
        return;
      }
      const authData = JSON.parse(localStorage.getItem("authData"));
      const token = authData?.accessToken;
      try {
        const response = await fetch(`http://localhost:8080/api/v1/menuitems/${id}/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Ошибка загрузки изображения");
          setImageSrc("https://via.placeholder.com/150");
          return;
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Ошибка при запросе изображения:", error);
        setImageSrc("https://via.placeholder.com/150");
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [id, dish]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <img
      src={imageSrc}
      alt={dish?.name || "Dish"}
      className={className}
      onClick={onClick} // Передача обработчика клика
    />
  );
};

ImageComponent.propTypes = {
  id: PropTypes.number.isRequired,
  dish: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func, // Проп для клика
};

export default ImageComponent;
