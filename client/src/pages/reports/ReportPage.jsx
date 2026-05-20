import { useEffect, useMemo, useState } from "react";

import {
  getFinanceData,
} from "../../api/financeApi";
import { getLabours } from "../../api/labourApi";
import { getMaterials } from "../../api/materialApi";
import { getSites } from "../../api/siteApi";
import { getVendors } from "../../api/vendorApi";
import ExcelExport from "../../components/reports/ExcelExport";
import PDFExport from "../../components/reports/PDFExport";
import ReportFilter from "../../components/reports/ReportFilter";
import ReportTable from "../../components/reports/ReportTable";
import isConnectionError from "../../utils/isConnectionError";

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
      site_id: item.site_id,
      created_at: formatDate(item.created_at),
    }),
    columns: [
      { key: "material_name", label: "Material" },
      { key: "unit", label: "Unit" },
      { key: "site_id", label: "Site ID" },
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
      contact_number: item.contact_number,
      email: item.email,
      address: item.address,
    }),
    columns: [
      { key: "vendor_name", label: "Vendor" },
      { key: "contact_number", label: "Contact" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address" },
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
      daily_wage: item.daily_wage,
      site_id: item.site_id,
    }),
    columns: [
      { key: "labour_name", label: "Labour" },
      { key: "contact_number", label: "Contact" },
      { key: "daily_wage", label: "Daily Wage" },
      { key: "site_id", label: "Site ID" },
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
          amount: item.amount,
          date: item.expense_date,
        })),
        ...receivables.map((item) => ({
          ...item,
          record_type: "Receivable",
          name: item.client_name || item.client_id,
          amount: item.pending_amount || item.total_amount,
          date: item.due_date || item.created_at,
        })),
        ...payments.map((item) => ({
          ...item,
          record_type: "Payment",
          name: item.client_name || item.client_id,
          amount: item.payment_amount,
          date: item.payment_date,
        })),
      ];
    },
    map: (item) => ({
      id: `${item.record_type}-${item.id}`,
      record_type: item.record_type,
      name: item.name,
      amount: item.amount,
      date: formatDate(item.date),
      notes: item.description || item.notes,
    }),
    columns: [
      { key: "record_type", label: "Type" },
      { key: "name", label: "Name" },
      { key: "amount", label: "Amount" },
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
      created_at: formatDate(item.created_at),
    }),
    columns: [
      { key: "site_name", label: "Site" },
      { key: "location", label: "Location" },
      { key: "description", label: "Description" },
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const rows = await config.load();

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
  }, [config]);

  const data = useMemo(
    () => rawData.map(config.map),
    [config, rawData]
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
