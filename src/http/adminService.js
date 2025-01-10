import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

// Получаем токен из localStorage
const getAuthToken = () => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  return authData?.accessToken || null;
};

// Конфигурируем axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Добавляем токен в каждый запрос (если есть)
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Получить список всех ингредиентов
export const getAllIngredients = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/ingredients`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

// Получить список всех блюд
export const getAllMenuItems = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/menuitems`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };
  
  // Создать новое блюдо
  export const createMenuItem = async (menuItem) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/menuitems`, menuItem);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };
  
  // Обновить существующее блюдо
  export const updateMenuItem = async (menuItem) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/menuitems`, menuItem);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };
  
  // Удалить блюдо
  export const deleteMenuItem = async (id) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/menuitems/${id}`);
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

// Функция для получения всех заказов
export const getAllOrders = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/orders`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };