import reportApi from "../api/reportApi";

export const getReports = async () => {
  const response = await reportApi.get("/");

  return response.data;
};

export const exportPDF = async () => {
  const response = await reportApi.get(
    "/export/pdf"
  );

  return response.data;
};

export const exportExcel = async () => {
  const response = await reportApi.get(
    "/export/excel"
  );

  return response.data;
};