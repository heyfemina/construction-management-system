function VendorDetails() {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Vendor Details
      </h1>

      <div
        style={{
          lineHeight: "2",
          fontSize: "18px",
        }}
      >
        <p>
          <strong>Vendor Name:</strong> ABC Suppliers
        </p>

        <p>
          <strong>Phone:</strong> 9876543210
        </p>

        <p>
          <strong>Email:</strong> abc@gmail.com
        </p>

        <p>
          <strong>Total Purchase:</strong> ₹ 2,50,000
        </p>

        <p>
          <strong>Pending Payment:</strong> ₹ 50,000
        </p>
      </div>
    </div>
  );
}

export default VendorDetails;