// file:        src/api/axiosInstance.ts


import axios from "axios";


// baseURL: "http://localhost:8000",
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// REQUEST interceptor (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }

  return config;
});


// RESPONSE interceptor (handle expired / invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - logging out");

      localStorage.clear();          // remove token, user, etc.
      window.location.href = "/login"; // force redirect
    }

    return Promise.reject(error);
  }
);


export default api;