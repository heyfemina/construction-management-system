import MaterialForm from "../../components/materials/MaterialForm";

function AddMaterial() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Add Material
      </h1>

      <MaterialForm />
    </div>
  );
}

export default AddMaterial;