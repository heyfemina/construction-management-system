import { useEffect, useState } from "react";
import {
  createMaterialPurchase,
  getMaterials,
} from "../../api/materialApi";
import { getSites } from "../../api/siteApi";
import { getVendors } from "../../api/vendorApi";
import ErrorDialog from "../common/ErrorDialog";
import {
  validateNonNegativeNumber,
  validatePositiveNumber,
  validateRequired,
} from "../../utils/formValidation";

function PurchaseForm() {
  const [materialId, setMaterialId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const total =
    Number(quantity) * Number(unitCost) +
    Number(transportCost || 0);

  const selectedMaterial = materials.find(
    (material) => String(material.id) === String(materialId)
  );

  const loadOptions = () => {
    Promise.all([getMaterials(), getVendors(), getSites()])
      .then(([materialsResponse, vendorsResponse, sitesResponse]) => {
        setMaterials(materialsResponse.data.materials || []);
        setVendors(vendorsResponse.data.vendors || []);
        setSites(sitesResponse.data.sites || []);
      })
      .catch(() => {
        setMaterials([]);
        setVendors([]);
        setSites([]);
      });
  };

  useEffect(() => {
    loadOptions();
    window.addEventListener("materials:changed", loadOptions);
    window.addEventListener("vendors:changed", loadOptions);
    window.addEventListener("sites:changed", loadOptions);

    return () => {
      window.removeEventListener("materials:changed", loadOptions);
      window.removeEventListener("vendors:changed", loadOptions);
      window.removeEventListener("sites:changed", loadOptions);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError =
      validateRequired([
        { label: "Material", value: materialId },
        { label: "Vendor", value: vendorId },
        { label: "Site", value: siteId },
        { label: "Quantity", value: quantity },
        { label: "Unit cost", value: unitCost },
        { label: "Transport cost", value: transportCost },
      ]) ||
      validatePositiveNumber(quantity, "Quantity") ||
      validatePositiveNumber(unitCost, "Unit cost") ||
      validateNonNegativeNumber(transportCost, "Transport cost");

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      await createMaterialPurchase({
        material_id: materialId || null,
        vendor_id: vendorId || null,
        site_id: siteId || null,
        quantity,
        unit_cost: unitCost,
        transport_cost: transportCost,
        total_cost: total,
        purchase_date: new Date().toISOString().slice(0, 10),
      });

      setMaterialId("");
      setVendorId("");
      setSiteId("");
      setQuantity("");
      setUnitCost("");
      setTransportCost("");
      window.dispatchEvent(new Event("materials:changed"));
      window.dispatchEvent(new Event("vendors:changed"));
      window.dispatchEvent(new Event("sites:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save purchase");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="material-entry-card">
      <div className="material-entry-header">
        <div>
          <p>Purchase</p>
          <h2>Material Purchase</h2>
        </div>
      </div>

      <form className="material-entry-form" onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <SelectField
          label="Material"
          required
          value={materialId}
          onChange={(nextMaterialId) => {
            setMaterialId(nextMaterialId);
            const material = materials.find(
              (item) => String(item.id) === String(nextMaterialId)
            );

            if (material?.site_id) {
              setSiteId(String(material.site_id));
            }
          }}
          options={materials.map((material) => ({
            value: material.id,
            label: `${material.material_name} (${material.site_name || "No site"})`,
          }))}
        />

        <div className="material-form-grid material-form-grid-two">
          <SelectField
            label="Vendor"
            required
            value={vendorId}
            onChange={setVendorId}
            options={vendors.map((vendor) => ({
              value: vendor.id,
              label: vendor.vendor_name,
            }))}
          />

          <SelectField
            label="Site"
            required
            value={siteId}
            onChange={setSiteId}
            options={sites.map((site) => ({
              value: site.id,
              label: site.site_name,
            }))}
          />
        </div>

        {selectedMaterial?.unit && (
          <p style={hintStyle}>
            Quantity unit: {selectedMaterial.unit}
          </p>
        )}

        <div className="material-form-grid material-form-grid-three">
          <InputField
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            placeholder="Enter quantity"
          />

          <InputField
            label="Unit Cost"
            value={unitCost}
            onChange={setUnitCost}
            placeholder="Enter unit cost"
          />

          <InputField
            label="Transport Cost"
            value={transportCost}
            onChange={setTransportCost}
            placeholder="Enter transport cost"
          />
        </div>

        <div className="material-total-cost">
          Total Cost: Rs. {total}
        </div>

        <button type="submit" className="material-form-button" disabled={saving}>
          {saving ? "Saving..." : "Save Purchase"}
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

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div className="material-field">
      <label>{label}</label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="material-field">
      <label>{label}</label>
      <input
        type="number"
        min="0"
        step="0.01"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

const errorStyle = {
  color: "#dc2626",
  margin: "0",
  fontWeight: "600",
};

const hintStyle = {
  margin: "-2px 0 0",
  color: "#6b7280",
  fontWeight: "600",
};

export default PurchaseForm;
