import React, { useState, useEffect } from 'react';

const ImageComponent = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем картинку с сервера
    const loadImage = async () => {
        try {
          console.log('Начинаем загрузку изображения...');
          const response = await fetch('http://localhost:8080/api/v1/menuitems/1/image', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          console.log('Ответ от сервера:', response);
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          // Логгируем все заголовки
          response.headers.forEach((value, key) => {
            console.log(`${key}: ${value}`);
          });
      
          // Получаем Content-Type
          const contentType = response.headers.get('Content-Type');
          console.log('Заголовок Content-Type:', contentType);
      
          if (!contentType || !contentType.startsWith('image/')) {
            throw new Error('Ответ не является изображением');
          }
      
          const blob = await response.blob();
          console.log('Blob загружен:', blob);
          const imageUrl = URL.createObjectURL(blob);
          console.log('Сгенерированный URL:', imageUrl);
          setImageSrc(imageUrl);
        } catch (error) {
          console.error('Ошибка при запросе изображения:', error);
        } finally {
          setLoading(false);
        }
      };
      

    loadImage();
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return imageSrc ? <img src={imageSrc} alt="Dish" /> : <p>Не удалось загрузить изображение</p>;
};

export default ImageComponent;
