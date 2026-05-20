import financeApi from "../api/financeApi";

export const getFinanceData = async () => {
  const response = await financeApi.get("/");

  return response.data;
};

export const addExpense = async (data) => {
  const response = await financeApi.post(
    "/expenses",
    data
  );

  return response.data;
};

export const addReceivable = async (data) => {
  const response = await financeApi.post(
    "/receivables",
    data
  );

  return response.data;
};

export const addPayment = async (data) => {
  const response = await financeApi.post(
    "/payments",
    data
  );

  return response.data;
};
