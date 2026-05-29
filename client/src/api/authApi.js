import API from "./axios";

export const loginUser = async (data) => {
  return await API.post("/auth/login", data);
};

export const registerUser = async (data) => {
  return await API.post("/auth/register", data);
};

export const getProfile = async () => {
  return await API.get("/auth/profile");
};

export const updateProfile = async (data) => {
  return await API.patch("/auth/profile", data);
};
