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

// Функция для создания заказа
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/orders`, orderData);
    return response.data; // Успешный ответ
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
  

// Функция для получения всех заказов пользователя
export const getAllUserOrders = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/orders/user-all`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getOrdersByCustomerId = async (customerId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/orders/user-all/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

// Функция для получения актуальных (активных) заказов пользователя
export const getActualUserOrders = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/orders/user-actual/`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Функция для отметки заказа как подготовленного
export const markOrderPrepared = async (orderId) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/orders/${orderId}/prepared`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
