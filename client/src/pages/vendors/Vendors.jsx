import VendorForm from "../../components/vendors/VendorForm";
import VendorTable from "../../components/vendors/VendorTable";
import VendorLedger from "../../components/vendors/VendorLedger";
import VendorPaymentForm from "../../components/vendors/VendorPaymentForm";
import VendorReport from "../../components/vendors/VendorReport";

function Vendors() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        Vendor Management
      </h1>

      <VendorForm />

      <VendorPaymentForm />

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <VendorTable />
      </div>

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <VendorLedger />
      </div>

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <VendorReport />
      </div>
    </div>
  );
}

export default Vendors;
