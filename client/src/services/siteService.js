import siteApi from "../api/siteApi";

export const getSites = async () => {
  const response = await siteApi.get("/");

  return response.data;
};

export const addSite = async (data) => {
  const response = await siteApi.post(
    "/",
    data
  );

  return response.data;
};

export const deleteSite = async (id) => {
  const response = await siteApi.delete(
    `/${id}`
  );

  return response.data;
};