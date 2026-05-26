import { useEffect, useState } from "react";
import { addLabour, updateLabour } from "../../services/labourService";
import { getSites } from "../../api/siteApi";
import ErrorDialog from "../common/ErrorDialog";
import FieldError from "../common/FieldError";
import {
  validatePhone,
  validatePositiveNumber,
} from "../../utils/formValidation";

function LabourForm({ labour = null, onSaved }) {
  const isEdit = Boolean(labour?.id);
  const [labourName, setLabourName] = useState(labour?.labour_name || "");
  const [contact, setContact] = useState(labour?.contact_number || "");
  const [dailyWage, setDailyWage] = useState(labour?.daily_wage || "");
  const [address, setAddress] = useState(labour?.address || "");
  const [siteId, setSiteId] = useState(labour?.site_id ? String(labour.site_id) : "");
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSites()
      .then((response) => setSites(response.data.sites || []))
      .catch(() => setSites([]));
  }, []);

  useEffect(() => {
    setLabourName(labour?.labour_name || "");
    setContact(labour?.contact_number || "");
    setDailyWage(labour?.daily_wage || "");
    setAddress(labour?.address || "");
    setSiteId(labour?.site_id ? String(labour.site_id) : "");
    setFieldErrors({});
  }, [labour]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors = {
      labourName: labourName.trim() ? "" : "Labour name is required",
      contact: contact.trim()
        ? validatePhone(contact)
        : "Contact number is required",
      dailyWage: dailyWage
        ? validatePositiveNumber(dailyWage, "Daily wage")
        : "Daily wage is required",
      siteId: siteId ? "" : "Site is required",
      address: address.trim() ? "" : "Address is required",
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        site_id: siteId || null,
        labour_name: labourName,
        contact_number: contact,
        address,
        daily_wage: dailyWage,
      };

      if (isEdit) {
        await updateLabour(labour.id, payload);
      } else {
        await addLabour(payload);
      }

      if (!isEdit) {
        setLabourName("");
        setContact("");
        setDailyWage("");
        setAddress("");
        setSiteId("");
      }
      setFieldErrors({});
      window.dispatchEvent(new Event("labours:changed"));
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save labour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div style={cardStyle}>
      <h2 style={headingStyle}>{isEdit ? "Edit Labour" : "Add Labour"}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Labour Name</label>
          <input
            type="text"
            required
            value={labourName}
            onChange={(e) => {
              setLabourName(e.target.value);
              setFieldErrors((current) => ({ ...current, labourName: "" }));
            }}
            placeholder="Enter labour name"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.labourName} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Contact Number</label>
          <input
            type="text"
            required
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              setFieldErrors((current) => ({ ...current, contact: "" }));
            }}
            placeholder="Enter contact number"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.contact} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Daily Wage</label>
          <input
            type="number"
            required
            value={dailyWage}
            onChange={(e) => {
              setDailyWage(e.target.value);
              setFieldErrors((current) => ({ ...current, dailyWage: "" }));
            }}
            placeholder="Enter daily wage"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.dailyWage} />
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
            <option value="">No site selected</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.site_name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.siteId} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setFieldErrors((current) => ({ ...current, address: "" }));
            }}
            placeholder="Enter address"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.address} />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Labour" : "Save Labour"}
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

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "20px",
};

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
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const errorStyle = {
  color: "#dc2626",
  marginBottom: "12px",
  fontWeight: "600",
};

export default LabourForm;
