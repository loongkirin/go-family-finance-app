import axios from 'axios';
import { siteConfig } from '@/config/site'

const RestApi = axios.create({
  baseURL: siteConfig.baseApiUrl,
  headers: { "Content-Type": "application/json" },
});

RestApi.interceptors.request.use(
  (config) => {
    console.log("request", config);
    // Add auth token or other headers here
    const token = localStorage.getItem("token");
    if (token && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
      // config.headers["x-authorization"] =`x-bearer ${token}`;
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
    console.log("response", error);
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default RestApi;