import API from "./axios";

export const getMaterials = async () => {
  return await API.get("/materials");
};

export const getMaterialActivity = async () => {
  return await API.get("/materials/activity");
};

export const getSingleMaterial = async (id) => {
  return await API.get(`/materials/${id}`);
};

export const createMaterial = async (data) => {
  return await API.post("/materials", data);
};

export const updateMaterial = async (id, data) => {
  return await API.put(`/materials/${id}`, data);
};

export const deleteMaterial = async (id) => {
  return await API.delete(`/materials/${id}`);
};

export const createMaterialPurchase = async (data) => {
  return await API.post("/materials/purchases", data);
};

export const createMaterialUsage = async (data) => {
  return await API.post("/materials/usage", data);
};

export default {
  get: (path = "") => API.get(`/materials${path}`),
  post: (path = "", data) => API.post(`/materials${path}`, data),
  put: (path = "", data) => API.put(`/materials${path}`, data),
  delete: (path = "") => API.delete(`/materials${path}`),
};
