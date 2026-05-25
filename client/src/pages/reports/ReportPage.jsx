import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  getFinanceData,
} from "../../api/financeApi";
import { getLabourActivity, getLabours } from "../../api/labourApi";
import { getMaterials } from "../../api/materialApi";
import { getSites } from "../../api/siteApi";
import { getVendors } from "../../api/vendorApi";
import ExcelExport from "../../components/reports/ExcelExport";
import PDFExport from "../../components/reports/PDFExport";
import ReportFilter from "../../components/reports/ReportFilter";
import ReportTable from "../../components/reports/ReportTable";
import isConnectionError from "../../utils/isConnectionError";

const money = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const reportConfigs = {
  materials: {
    title: "Material Reports",
    fileName: "Material Reports",
    tableTitle: "Material List",
    load: async () => {
      const response = await getMaterials();
      return response.data.materials || [];
    },
    map: (item) => ({
      id: item.id,
      material_name: item.material_name,
      unit: item.unit,
      site_name: item.site_name || item.site_id || "-",
      total_received: item.total_received || 0,
      total_used: item.total_used || 0,
      remaining_stock: item.remaining_stock || 0,
      avg_unit_cost: money(item.avg_unit_cost),
      total_cost: money(item.total_cost),
      transport_cost: money(item.transport_cost),
      created_at: formatDate(item.created_at),
    }),
    columns: [
      { key: "material_name", label: "Material" },
      { key: "unit", label: "Unit" },
      { key: "site_name", label: "Site" },
      { key: "total_received", label: "Received" },
      { key: "total_used", label: "Used" },
      { key: "remaining_stock", label: "Remaining" },
      { key: "avg_unit_cost", label: "Cost / Unit" },
      { key: "total_cost", label: "Total Cost" },
      { key: "transport_cost", label: "Transport" },
      { key: "created_at", label: "Created Date" },
    ],
  },
  vendors: {
    title: "Vendor Reports",
    fileName: "Vendor Reports",
    tableTitle: "Vendor List",
    load: async () => {
      const response = await getVendors();
      return response.data.vendors || [];
    },
    map: (item) => ({
      id: item.id,
      vendor_name: item.vendor_name,
      site_name: item.site_name || "-",
      contact_number: item.contact_number,
      email: item.email,
      address: item.address,
      total_purchase: money(item.total_purchase),
      paid_amount: money(item.paid_amount),
      pending_amount: money(item.pending_amount),
    }),
    columns: [
      { key: "vendor_name", label: "Vendor" },
      { key: "site_name", label: "Site" },
      { key: "contact_number", label: "Contact" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address" },
      { key: "total_purchase", label: "Purchase" },
      { key: "paid_amount", label: "Paid" },
      { key: "pending_amount", label: "Pending" },
    ],
  },
  "labour-attendance": {
    title: "Labour Attendance Report",
    fileName: "Labour Attendance Report",
    tableTitle: "All Labour Attendance",
    searchLabel: "Search Labour",
    searchPlaceholder: "Search labour name",
    searchFields: ["labour_name"],
    serverSearch: true,
    load: async (search = "") => {
      const response = await getLabourActivity(search);
      return response.data.attendance || [];
    },
    map: (item) => ({
      id: item.id,
      attendance_date: formatDate(item.attendance_date),
      labour_name: item.labour_name,
      site_name: item.site_name || "-",
      status: item.status || "Present",
      created_at: formatDate(item.created_at),
    }),
    columns: [
      { key: "attendance_date", label: "Date" },
      { key: "labour_name", label: "Labour Name" },
      { key: "site_name", label: "Site" },
      { key: "status", label: "Attendance Status" },
      { key: "created_at", label: "Marked At" },
    ],
  },
  labours: {
    title: "Labour Reports",
    fileName: "Labour Reports",
    tableTitle: "Labour List",
    load: async () => {
      const response = await getLabours();
      return response.data.labours || [];
    },
    map: (item) => ({
      id: item.id,
      labour_name: item.labour_name,
      contact_number: item.contact_number,
      daily_wage: money(item.daily_wage),
      site_name: item.site_name || item.site_id || "-",
      attendance_count: item.attendance_count || 0,
      total_wage: money(item.total_wage),
      paid_amount: money(item.paid_amount),
      pending_amount: money(item.pending_amount),
    }),
    columns: [
      { key: "labour_name", label: "Labour" },
      { key: "contact_number", label: "Contact" },
      { key: "daily_wage", label: "Daily Wage" },
      { key: "site_name", label: "Site" },
      { key: "attendance_count", label: "Attendance" },
      { key: "total_wage", label: "Total Wage" },
      { key: "paid_amount", label: "Paid" },
      { key: "pending_amount", label: "Pending" },
    ],
  },
  financial: {
    title: "Financial Reports",
    fileName: "Financial Reports",
    tableTitle: "Finance Records",
    load: async () => {
      const response = await getFinanceData();
      const expenses = response.data.expenses || [];
      const receivables = response.data.receivables || [];
      const payments = response.data.payments || [];

      return [
        ...expenses.map((item) => ({
          ...item,
          record_type: "Expense",
          name: item.expense_type,
          total_amount: item.amount,
          received_amount: "",
          pending_amount: "",
          date: item.expense_date,
        })),
        ...receivables.map((item) => ({
          ...item,
          record_type: "Receivable",
          name: item.client_name || item.client_id,
          total_amount: item.total_amount,
          received_amount: item.received_amount,
          pending_amount: item.pending_amount,
          date: item.due_date || item.created_at,
        })),
        ...payments.map((item) => ({
          ...item,
          record_type: "Payment",
          name: item.client_name || item.client_id,
          total_amount: "",
          received_amount: item.payment_amount,
          pending_amount: "",
          date: item.payment_date,
        })),
      ];
    },
    map: (item) => ({
      id: `${item.record_type}-${item.id}`,
      record_type: item.record_type,
      name: item.name,
      total_amount:
        item.total_amount === "" ? "-" : money(item.total_amount),
      received_amount:
        item.received_amount === "" ? "-" : money(item.received_amount),
      pending_amount:
        item.pending_amount === "" ? "-" : money(item.pending_amount),
      date: formatDate(item.date),
      notes: item.description || item.notes,
    }),
    columns: [
      { key: "record_type", label: "Type" },
      { key: "name", label: "Name" },
      { key: "total_amount", label: "Total" },
      { key: "received_amount", label: "Received" },
      { key: "pending_amount", label: "Pending" },
      { key: "date", label: "Date" },
      { key: "notes", label: "Notes" },
    ],
  },
  sites: {
    title: "Site Reports",
    fileName: "Site Reports",
    tableTitle: "Site List",
    load: async () => {
      const response = await getSites();
      return response.data.sites || [];
    },
    map: (item) => ({
      id: item.id,
      site_name: item.site_name,
      location: item.location,
      description: item.description,
      material_cost: money(item.material_cost),
      total_expense: money(item.total_expense),
      vendor_count: item.vendor_count || 0,
      labour_count: item.labour_count || 0,
      created_at: formatDate(item.created_at),
    }),
    columns: [
      { key: "site_name", label: "Site" },
      { key: "location", label: "Location" },
      { key: "description", label: "Description" },
      { key: "material_cost", label: "Material Cost" },
      { key: "total_expense", label: "Expenses" },
      { key: "vendor_count", label: "Vendors" },
      { key: "labour_count", label: "Labours" },
      { key: "created_at", label: "Created Date" },
    ],
  },
};

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString();
}

function ReportPage({ type }) {
  const config = reportConfigs[type];
  const [rawData, setRawData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadSearch = config.serverSearch ? search : "";

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const rows = await config.load(loadSearch);

        if (active) {
          setRawData(rows);
        }
      } catch (err) {
        if (active) {
          if (isConnectionError(err)) {
            setRawData([]);
            setError("");
            return;
          }

          setError(
            err.response?.data?.message ||
              "Could not load report data"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReport();

    return () => {
      active = false;
    };
  }, [config, loadSearch]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (config.serverSearch || !query || !config.searchFields?.length) {
      return rawData;
    }

    return rawData.filter((item) =>
      config.searchFields.some((field) =>
        String(item[field] || "").toLowerCase().includes(query)
      )
    );
  }, [config, rawData, search]);

  const data = useMemo(
    () => filteredRows.map(config.map),
    [config, filteredRows]
  );

  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        {config.title}
      </h1>

      <ReportFilter value={type} />

      {config.helperText && (
        <p
          style={{
            color: "#4b5563",
            fontWeight: "600",
            margin: "-8px 0 18px",
          }}
        >
          {config.helperText}
        </p>
      )}

      {config.searchFields?.length > 0 && (
        <div className="report-search-card">
          <label
            htmlFor="report-search"
            className="report-search-label"
          >
            {config.searchLabel || "Search"}
          </label>
          <div className="report-search-field">
            <Search
              size={18}
              strokeWidth={2.3}
              className="report-search-icon"
            />
            <input
              id="report-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={config.searchPlaceholder || "Search report"}
              className="report-search-input"
            />
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <PDFExport
          data={data}
          columns={config.columns}
          fileName={config.fileName}
        />

        <ExcelExport
          data={data}
          columns={config.columns}
          fileName={config.fileName}
        />
      </div>

      <ReportTable
        title={config.tableTitle}
        data={data}
        columns={config.columns}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default ReportPage;
