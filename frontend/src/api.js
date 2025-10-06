import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3443/api",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
}, (err) => Promise.reject(err));

export default api;
