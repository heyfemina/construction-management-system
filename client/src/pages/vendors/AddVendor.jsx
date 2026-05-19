import VendorForm from "../../components/vendors/VendorForm";

function AddVendor() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Add Vendor
      </h1>

      <VendorForm />
    </div>
  );
}

export default AddVendor;