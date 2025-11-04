// frontend/src/api.js
import axios from "axios/dist/browser/axios.cjs";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://localhost:5000/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const signup = async (payload) => {
  const res = await api.post("/auth/signup", payload);
  return res.data;
};

export const fetchPayments = async () => {
  const res = await api.get("/payments");
  return res.data;
};

export const createPayment = async (payload) => {
  const res = await api.post("/payments", payload);
  return res.data;
};

export const verifyPayment = async (id) => {
  const res = await api.patch(`/payments/${id}/verify`);
  return res.data;
};

export const submitPayment = async (id) => {
  const res = await api.patch(`/payments/${id}/submit`);
  return res.data;
};

export const rejectPayment = async (id) => {
  const res = await api.patch(`/payments/${id}/reject`);
  return res.data;
};

export const fetchAdminMetrics = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export default api;
