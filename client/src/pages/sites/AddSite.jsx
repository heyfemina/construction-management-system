import SiteForm from "../../components/sites/SiteForm";

function AddSite() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Add Site
      </h1>

      <SiteForm />
    </div>
  );
}

export default AddSite;