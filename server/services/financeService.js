export const calculatePendingAmount =
  (
    totalAmount,
    receivedAmount
  ) => {
    return (
      totalAmount - receivedAmount
    );
  };

export const createExpenseService =
  async (expenseData) => {
    return {
      ...expenseData,
      created_at: new Date(),
    };
  };