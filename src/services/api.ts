import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const notificationApi = {
  getNotifications: async (userId: string) => {
    const response = await apiClient.get(`/notifications/${userId}`);
    return response.data;
  },
  markAsRead: async (notificationId: string) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  deleteNotification: async (notificationId: string) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
  createNotification: async (
    userId: string,
    notificationData: { type: string; title: string; message: string }
  ) => {
    const response = await apiClient.post(`/notifications/${userId}`, notificationData);
    return response.data;
  },
};

export default apiClient;
