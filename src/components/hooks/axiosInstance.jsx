import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sugarytestapi.azurewebsites.net/",
});

// request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
