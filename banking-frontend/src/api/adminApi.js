import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088/api/admin",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAdminDashboard = () =>
  api.get("/dashboard");

export const getPendingLoans = () =>
  api.get("/dashboard/loans/pending");

export const approveLoan = (id) =>
  api.patch(`/dashboard/loans/${id}/approve`);

export const rejectLoan = (id) =>
  api.patch(`/dashboard/loans/${id}/reject`);