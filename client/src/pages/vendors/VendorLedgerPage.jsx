import VendorLedger from "../../components/vendors/VendorLedger";

function VendorLedgerPage() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Vendor Ledger
      </h1>

      <VendorLedger />
    </div>
  );
}

export default VendorLedgerPage;