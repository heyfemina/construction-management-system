import ExpenseTable from "../../components/finance/ExpenseTable";

function Expenses() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Expenses
      </h1>

      <ExpenseTable />
    </div>
  );
}

export default Expenses;