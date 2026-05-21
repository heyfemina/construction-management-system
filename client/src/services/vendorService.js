import vendorApi from "../api/vendorApi";

export const getVendors = async () => {
  const response = await vendorApi.get("/");

  return response.data;
};

export const addVendor = async (data) => {
  const response = await vendorApi.post(
    "/",
    data
  );

  return response.data;
};

export const updateVendor = async (id, data) => {
  const response = await vendorApi.put(
    `/${id}`,
    data
  );

  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await vendorApi.delete(
    `/${id}`
  );

  return response.data;
};
