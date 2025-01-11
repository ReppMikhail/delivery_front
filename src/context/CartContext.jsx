import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Инициализация корзины из localStorage
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Сохраняем корзину в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (dish) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === dish.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...dish, quantity: 1 }];
    });
  };

  const setCartItemsDirectly = (items) => {
    setCartItems(items);
  };
  

  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Удаляем товары с количеством <= 0
    );
  };

  const clearCart = () => {
    setCartItems([]); // Очищаем весь массив
  };

  const deleteFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id) // Удаляем полностью элемент с указанным id
    );
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0'); // ДД
    const month = String(date.getMonth() + 1).padStart(2, '0'); // ММ (месяцы начинаются с 0)
    const year = date.getFullYear(); // ГГГГ
    const hours = String(date.getHours()).padStart(2, '0'); // ЧЧ
    const minutes = String(date.getMinutes()).padStart(2, '0'); // ММ
  
    return `${day}.${month}.${year} ${hours}:${minutes}`; // Форматируем строку
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        deleteFromCart,
        formatDate,
        setCartItemsDirectly, // Добавляем эту функцию
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
