import ClientForm from "../../components/finance/ClientForm";
import ExpenseForm from "../../components/finance/ExpenseForm";
import ReceivableTable from "../../components/finance/ReceivableTable";
import PaymentForm from "../../components/finance/PaymentForm";
import ExpenseTable from "../../components/finance/ExpenseTable";
import FinanceReport from "../../components/finance/FinanceReport";
import PartyLedger from "../../components/finance/PartyLedger";

function Finance() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        Finance Management
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))",
          gap: "20px",
        }}
      >
        <ClientForm />

        <ExpenseForm />

        <PaymentForm />
      </div>

      <ReceivableTable />

      <ExpenseTable />

      <PartyLedger />

      <FinanceReport />
    </div>
  );
}

export default Finance;
