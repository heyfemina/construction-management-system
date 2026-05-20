import API from "./axios";

export const getMaterialReports = async () => {
  return await API.get("/reports/materials");
};

export const getVendorReports = async () => {
  return await API.get("/reports/vendors");
};

export const getLabourReports = async () => {
  return await API.get("/reports/labours");
};

export const getFinancialReports = async () => {
  return await API.get("/reports/financial");
};

export const exportPDF = async () => {
  return await API.get("/reports/export/pdf");
};

export const exportExcel = async () => {
  return await API.get("/reports/export/excel");
};

export default {
  get: (path = "") => API.get(`/reports${path}`),
};
