import API from "./axios";

export const getSites = async () => {
  return await API.get("/sites");
};

export const getSingleSite = async (id) => {
  return await API.get(`/sites/${id}`);
};

export const createSite = async (data) => {
  return await API.post("/sites", data);
};

export const updateSite = async (id, data) => {
  return await API.put(`/sites/${id}`, data);
};

export const deleteSite = async (id) => {
  return await API.delete(`/sites/${id}`);
};

export default {
  get: (path = "") => API.get(`/sites${path}`),
  post: (path = "", data) => API.post(`/sites${path}`, data),
  put: (path = "", data) => API.put(`/sites${path}`, data),
  delete: (path = "") => API.delete(`/sites${path}`),
};
