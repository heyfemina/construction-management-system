import {
  getProfile as getProfileRequest,
  loginUser as loginRequest,
  registerUser as registerRequest,
} from "../api/authApi";

export const loginUser = async (data) => {
  const response = await loginRequest(data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await registerRequest(data);
  return response.data;
};

export const getProfile = async () => {
  const response = await getProfileRequest();
  return response.data;
};
