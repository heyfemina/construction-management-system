import PaymentForm from "../../components/finance/PaymentForm";

function Payments() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Payments
      </h1>

      <PaymentForm />
    </div>
  );
}

export default Payments;