import API from "./axios";

export const getFinanceData = async () => {
  return await API.get("/finance");
};

export const getPartyLedger = async (clientId) => {
  return await API.get(`/finance/ledger/${clientId}`);
};

export const createExpense = async (data) => {
  return await API.post("/finance/expenses", data);
};

export const createReceivable = async (data) => {
  return await API.post("/finance/receivables", data);
};

export const getExpenses = async () => {
  return await API.get("/finance");
};

export const createPayment = async (data) => {
  return await API.post("/finance/payments", data);
};

export const getPayments = async () => {
  return await API.get("/finance");
};

export const getDashboardSummary = async () => {
  return await API.get("/finance/summary");
};

export default {
  get: (path = "") => API.get(`/finance${path}`),
  post: (path = "", data) => API.post(`/finance${path}`, data),
};
