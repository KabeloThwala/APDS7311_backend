// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Make sure this is HTTP, not HTTPS
});

// Attach token if user logged in
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

// ✅ Add helper functions for login and signup
export const login = async (accountNumber, password) => {
  const res = await api.post("/auth/login", { accountNumber, password });
  return res.data;
};

export const signup = async (fullName, idNumber, accountNumber, password) => {
  const res = await api.post("/auth/signup", {
    fullName,
    idNumber,
    accountNumber,
    password,
  });
  return res.data;
};

export default api;
