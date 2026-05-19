import labourApi from "../api/labourApi";

export const getLabours = async () => {
  const response = await labourApi.get("/");

  return response.data;
};

export const addLabour = async (data) => {
  const response = await labourApi.post(
    "/",
    data
  );

  return response.data;
};

export const deleteLabour = async (id) => {
  const response = await labourApi.delete(
    `/${id}`
  );

  return response.data;
};