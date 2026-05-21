import API from "./axios";

export const getLabours = async () => {
  return await API.get("/labours");
};

export const getLabourActivity = async () => {
  return await API.get("/labours/activity");
};

export const getLabourLedger = async (id) => {
  return await API.get(`/labours/ledger/${id}`);
};

export const getSingleLabour = async (id) => {
  return await API.get(`/labours/${id}`);
};

export const createLabour = async (data) => {
  return await API.post("/labours", data);
};

export const updateLabour = async (id, data) => {
  return await API.put(`/labours/${id}`, data);
};

export const deleteLabour = async (id) => {
  return await API.delete(`/labours/${id}`);
};

export const createAttendance = async (data) => {
  return await API.post("/labours/attendance", data);
};

export const createWage = async (data) => {
  return await API.post("/labours/wages", data);
};

export const createLabourPayment = async (data) => {
  return await API.post("/labours/payments", data);
};

export default {
  get: (path = "") => API.get(`/labours${path}`),
  post: (path = "", data) => API.post(`/labours${path}`, data),
  put: (path = "", data) => API.put(`/labours${path}`, data),
  delete: (path = "") => API.delete(`/labours${path}`),
};
