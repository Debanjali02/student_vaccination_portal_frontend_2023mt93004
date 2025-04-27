import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Replace with your API URL

const api = {
  login: (username, password) => {
    return axios.post(`${API_URL}/auth/login`, { username, password });
  },
  getDashboardData: () => {
    return axios.get(`${API_URL}/dashboard/overview`);
  },
  // Add other API methods for students, vaccination, reports, etc.
};

export default api;
