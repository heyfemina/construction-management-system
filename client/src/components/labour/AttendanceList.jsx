import { useEffect, useMemo, useState } from "react";
import { getLabourActivity, getLabours } from "../../api/labourApi";

function AttendanceList() {
  const [labours, setLabours] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedLabourId, setSelectedLabourId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const [laboursResponse, activityResponse] = await Promise.all([
        getLabours(),
        getLabourActivity(),
      ]);

      setLabours(laboursResponse.data.labours || []);
      setAttendance(activityResponse.data.attendance || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
    window.addEventListener("labours:changed", loadAttendance);

    return () => {
      window.removeEventListener("labours:changed", loadAttendance);
    };
  }, []);

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance.filter((item) => {
      const matchesLabour =
        !selectedLabourId || String(item.labour_id) === selectedLabourId;
      const matchesSearch =
        !query || String(item.labour_name || "").toLowerCase().includes(query);

      return matchesLabour && matchesSearch;
    });
  }, [attendance, search, selectedLabourId]);

  const selectedLabour = useMemo(
    () =>
      labours.find((labour) => String(labour.id) === selectedLabourId) || null,
    [labours, selectedLabourId]
  );

  const dailyCounts = useMemo(() => {
    const counts = new Map();

    filteredAttendance.forEach((item) => {
      if ((item.status || "Present").toLowerCase() !== "present") {
        return;
      }

      const key = item.attendance_date
        ? new Date(item.attendance_date).toISOString().slice(0, 10)
        : "No date";
      const current = counts.get(key) || { workers: 0, payment: 0 };

      counts.set(key, {
        workers: current.workers + 1,
        payment: current.payment + Number(item.attendance_payment || 0),
      });
    });

    return Array.from(counts.entries()).map(([date, summary]) => ({
      date,
      workers: summary.workers,
      payment: summary.payment,
    }));
  }, [filteredAttendance]);

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={headingStyle}>Attendance Report</h2>
          <p style={mutedStyle}>
            {selectedLabour
              ? `${selectedLabour.labour_name}: ${filteredAttendance.length} day(s)`
              : `${filteredAttendance.length} attendance day(s)`}
          </p>
        </div>
      </div>

      <div style={filterGridStyle}>
        <div>
          <label>Search Labour</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type labour name"
            style={inputStyle}
          />
        </div>

        <div>
          <label>Select Labour</label>
          <select
            value={selectedLabourId}
            onChange={(e) => setSelectedLabourId(e.target.value)}
            style={inputStyle}
          >
            <option value="">All labours</option>
            {labours.map((labour) => (
              <option key={labour.id} value={labour.id}>
                {labour.labour_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={summaryGridStyle}>
        {dailyCounts.slice(0, 6).map((item) => (
          <div key={item.date} style={summaryCardStyle}>
            <strong>{formatDate(item.date)}</strong>
            <span>
              {item.workers} worker(s) / Rs. {formatNumber(item.payment)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHead}>Day</th>
              <th style={tableHead}>Date</th>
              <th style={tableHead}>Labour Name</th>
              <th style={tableHead}>Site</th>
              <th style={tableHead}>Payment</th>
              <th style={tableHead}>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && <StatusRow text="Loading attendance..." />}
            {!loading && error && <StatusRow text={error} />}
            {!loading && !error && filteredAttendance.length === 0 && (
              <StatusRow text="No attendance records found" />
            )}

            {!loading &&
              !error &&
              filteredAttendance.map((item) => (
                <tr key={item.id}>
                  <td style={tableData}>
                    {formatDay(item.attendance_day, item.attendance_date)}
                  </td>
                  <td style={tableData}>{formatDate(item.attendance_date)}</td>
                  <td style={tableData}>{item.labour_name || "-"}</td>
                  <td style={tableData}>{item.site_name || "-"}</td>
                  <td style={tableData}>
                    Rs. {formatNumber(item.attendance_payment)}
                  </td>
                  <td style={tableData}>{item.status || "Present"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusRow({ text }) {
  return (
    <tr>
      <td style={tableData} colSpan="6">
        {text}
      </td>
    </tr>
  );
}

function formatDay(day, value) {
  const cleanedDay = String(day || "").trim();

  if (cleanedDay) return cleanedDay;
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
  });
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
  marginTop: "20px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  margin: 0,
};

const mutedStyle = {
  margin: "6px 0 0",
  color: "#6b7280",
  fontWeight: "600",
};

const filterGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginBottom: "20px",
};

const summaryCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  padding: "12px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHead = {
  borderBottom: "1px solid #d1d5db",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f3f4f6",
};

const tableData = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
};

export default AttendanceList;
