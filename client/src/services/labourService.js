import labourApi from "../api/labourApi";

export const getLabours = async () => {
  const response = await labourApi.get("/");

  return response.data;
};

export const getLabour = async (id) => {
  const response = await labourApi.get(`/${id}`);

  return response.data;
};

export const addLabour = async (data) => {
  const response = await labourApi.post(
    "/",
    data
  );

  return response.data;
};

export const updateLabour = async (id, data) => {
  const response = await labourApi.put(
    `/${id}`,
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
