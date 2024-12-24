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

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/auth';

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data; // Успешный ответ
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Функция для входа пользователя
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, userData);
        return response.data; // Успешный ответ
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};