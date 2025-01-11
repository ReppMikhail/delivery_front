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

// Получить список всех видов кухни
export const getAllKitchens = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/kitchens`);
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

  // Добавить картинку
  export const addImage = async (id, image) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/menuitems/${id}/image`, image);
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

  export const getAllManagers = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/users/managers`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  export const getAllCouriers = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/users/couriers`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  export const getAllCustomers = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/users/customers`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  export const createEmployee = async (employeeData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/auth/register-for-admin`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  export const createCustomer = async (customerData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/auth/register`, customerData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  export const updateUser = async (id, userData) => {
    try {
      await axiosInstance.put(`${API_BASE_URL}/users/${id}`, userData);
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  export const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/users/${id}`);
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

// Функция для получения пользователя по его id
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/users/${id}/no-orders`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Функция для получения курьера по его id
export const getCourierById = async (courierId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/couriers/${courierId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getCouriersOnShift = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/couriers/all-on-shift`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};