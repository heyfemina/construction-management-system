import { useEffect, useState } from "react";
import {
  createAttendance,
  getLabours,
} from "../../api/labourApi";
import { getSites } from "../../api/siteApi";
import ErrorDialog from "../common/ErrorDialog";
import FieldError from "../common/FieldError";

function AttendanceForm() {
  const [labourId, setLabourId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [date, setDate] = useState("");
  const [labours, setLabours] = useState([]);
  const [sites, setSites] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const loadOptions = () => {
    Promise.all([getLabours(), getSites()])
      .then(([laboursResponse, sitesResponse]) => {
        setLabours(laboursResponse.data.labours || []);
        setSites(sitesResponse.data.sites || []);
      })
      .catch(() => {
        setLabours([]);
        setSites([]);
      });
  };

  useEffect(() => {
    loadOptions();
    window.addEventListener("labours:changed", loadOptions);
    window.addEventListener("sites:changed", loadOptions);

    return () => {
      window.removeEventListener("labours:changed", loadOptions);
      window.removeEventListener("sites:changed", loadOptions);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors = {
      labourId: labourId ? "" : "Labour is required",
      siteId: siteId ? "" : "Site is required",
      date: date ? "" : "Date is required",
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setSaving(true);

    try {
      await createAttendance({
        labour_id: labourId || null,
        site_id: siteId || null,
        attendance_date: date,
        status: "Present",
      });

      setLabourId("");
      setSiteId("");
      setDate("");
      setFieldErrors({});
      window.dispatchEvent(new Event("labours:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not mark attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Attendance
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "15px" }}>
          <label>Labour</label>
          <select
            required
            value={labourId}
            onChange={(e) => {
              setLabourId(e.target.value);
              setFieldErrors((current) => ({ ...current, labourId: "" }));
            }}
            style={inputStyle}
          >
            <option value="">Select labour</option>
            {labours.map((labour) => (
              <option key={labour.id} value={labour.id}>
                {labour.labour_name} - Rs. {labour.daily_wage}/day
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.labourId} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Site</label>
          <select
            required
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value);
              setFieldErrors((current) => ({ ...current, siteId: "" }));
            }}
            style={inputStyle}
          >
            <option value="">Select site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.site_name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.siteId} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Date</label>

          <input
            type="date"
            required
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setFieldErrors((current) => ({ ...current, date: "" }));
            }}
            style={inputStyle}
          />
          <FieldError message={fieldErrors.date} />
        </div>

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? "Saving..." : "Mark Attendance"}
        </button>
      </form>
    </div>
    <ErrorDialog
      isOpen={Boolean(error)}
      message={error}
      onClose={() => setError("")}
    />
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#059669",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default AttendanceForm;
