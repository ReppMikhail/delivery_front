// import httpClient from "./httpClient";

// export const registerUser = async (userData) => {
//   const response = await httpClient.post("/auth/register", userData);
//   return response.data;
// };

// export const loginUser = async (credentials) => {
//   const response = await httpClient.post("/auth/login", credentials);
//   return response.data;
// };

// export const refreshToken = async () => {
//   const response = await httpClient.get("/auth/refresh");
//   return response.data;
// };

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

// Функция для получения списка блюд
export const fetchDishes = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/menuitems`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data; // Успешный ответ
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Функция для входа пользователя
export const loginUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
      return {
        id: response.data.id,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

//   export const fetchDishes = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/menuitems/get all`);
//       return response.data;
//     } catch (error) {
//       throw error.response ? error.response.data : new Error("Network Error");
//     }
//   };
  