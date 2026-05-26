import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LabourForm from "../../components/labour/LabourForm";
import { getLabour } from "../../services/labourService";

function EditLabour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [labour, setLabour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLabour = async () => {
      try {
        setLoading(true);
        const data = await getLabour(id);
        setLabour(data.labour);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load labour");
      } finally {
        setLoading(false);
      }
    };

    loadLabour();
  }, [id]);

  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Edit Labour
      </h1>

      {loading && <p>Loading...</p>}
      {!loading && error && <p style={errorStyle}>{error}</p>}
      {!loading && !error && labour && (
        <LabourForm labour={labour} onSaved={() => navigate("/labour")} />
      )}
    </div>
  );
}

const errorStyle = {
  color: "#dc2626",
  fontWeight: "600",
};

export default EditLabour;
