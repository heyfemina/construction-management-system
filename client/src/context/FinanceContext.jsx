import { createContext, useState } from "react";

export const FinanceContext = createContext();

function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const addPayment = (payment) => {
    setPayments([...payments, payment]);
  };

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        payments,
        addExpense,
        addPayment,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export default FinanceProvider;