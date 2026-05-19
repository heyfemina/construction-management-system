import MaterialForm from "../../components/materials/MaterialForm";

function EditMaterial() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Edit Material
      </h1>

      <MaterialForm />
    </div>
  );
}

export default EditMaterial;