import API from "./axios";

export const getVendors = async () => {
  return await API.get("/vendors");
};

export const getSingleVendor = async (id) => {
  return await API.get(`/vendors/${id}`);
};

export const createVendor = async (data) => {
  return await API.post("/vendors", data);
};

export const updateVendor = async (id, data) => {
  return await API.put(`/vendors/${id}`, data);
};

export const deleteVendor = async (id) => {
  return await API.delete(`/vendors/${id}`);
};

export const createVendorPayment = async (data) => {
  return await API.post("/vendors/payments", data);
};

export default {
  get: (path = "") => API.get(`/vendors${path}`),
  post: (path = "", data) => API.post(`/vendors${path}`, data),
  put: (path = "", data) => API.put(`/vendors${path}`, data),
  delete: (path = "") => API.delete(`/vendors${path}`),
};
