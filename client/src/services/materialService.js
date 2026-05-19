import materialApi from "../api/materialApi";

export const getMaterials = async () => {
  const response = await materialApi.get("/");

  return response.data;
};

export const addMaterial = async (data) => {
  const response = await materialApi.post(
    "/",
    data
  );

  return response.data;
};

export const deleteMaterial = async (id) => {
  const response = await materialApi.delete(
    `/${id}`
  );

  return response.data;
};