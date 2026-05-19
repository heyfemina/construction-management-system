import { useEffect, useState } from "react";
import { getFinanceData } from "../../services/financeService";

function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFinance = async () => {
    try {
      setLoading(true);
      const data = await getFinanceData();
      setExpenses(data.expenses || []);
      setPayments(data.payments || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load finance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
    window.addEventListener("finance:changed", loadFinance);

    return () => {
      window.removeEventListener("finance:changed", loadFinance);
    };
  }, []);

  return (
    <div style={wrapStyle}>
      <h2 style={headingStyle}>Expenses</h2>
      <SimpleTable
        loading={loading}
        error={error}
        emptyText="No expenses yet"
        headers={["Expense Type", "Amount", "Date"]}
        rows={expenses.map((expense) => [
          expense.expense_type,
          `Rs. ${expense.amount}`,
          expense.expense_date,
        ])}
      />

      <h2 style={{ ...headingStyle, marginTop: "25px" }}>Payments</h2>
      <SimpleTable
        loading={loading}
        error={error}
        emptyText="No payments yet"
        headers={["Amount", "Method", "Date"]}
        rows={payments.map((payment) => [
          `Rs. ${payment.payment_amount}`,
          payment.payment_method || "-",
          payment.payment_date,
        ])}
      />
    </div>
  );
}

function SimpleTable({ headers, rows, loading, error, emptyText }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} style={tableHead}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading && <StatusRow colSpan={headers.length} text="Loading..." />}
        {!loading && error && <StatusRow colSpan={headers.length} text={error} />}
        {!loading && !error && rows.length === 0 && (
          <StatusRow colSpan={headers.length} text={emptyText} />
        )}
        {!loading &&
          !error &&
          rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={tableData}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function StatusRow({ colSpan, text }) {
  return (
    <tr>
      <td style={tableData} colSpan={colSpan}>
        {text}
      </td>
    </tr>
  );
}

const wrapStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "20px",
};

const tableHead = {
  borderBottom: "1px solid #d1d5db",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f3f4f6",
};

const tableData = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
};

export default ExpenseTable;
