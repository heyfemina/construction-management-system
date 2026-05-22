import { useEffect, useState } from "react";
import SiteForm from "../../components/sites/SiteForm";
import SiteTable from "../../components/sites/SiteTable";
import SiteCard from "../../components/sites/SiteCard";
import { getSites } from "../../api/siteApi";

function Sites() {
  const [sites, setSites] = useState([]);

  const loadSites = async () => {
    const response = await getSites();
    setSites(response.data.sites || []);
  };

  useEffect(() => {
    loadSites();
    window.addEventListener("sites:changed", loadSites);

    return () => {
      window.removeEventListener("sites:changed", loadSites);
    };
  }, []);

  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        Site Management
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {sites.map((site) => (
          <SiteCard
            key={site.id}
            id={site.id}
            siteName={site.site_name}
            location={site.location || "-"}
            totalExpense={site.total_expense || 0}
            materialCount={site.material_count || 0}
            labourCount={site.labour_count || 0}
            vendorCount={site.vendor_count || 0}
            expenseCount={site.expense_count || 0}
          />
        ))}
      </div>

      <SiteForm />

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <SiteTable />
      </div>
    </div>
  );
}

export default Sites;
