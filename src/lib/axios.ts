import axios from 'axios';

const RestApi = axios.create({
  // baseURL: process.env.REST_API_URL,
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

RestApi.interceptors.request.use(
  (config) => {
    // Add auth token or other headers here
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

RestApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default RestApi;