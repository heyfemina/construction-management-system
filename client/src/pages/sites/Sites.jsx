import SiteForm from "../../components/sites/SiteForm";
import SiteTable from "../../components/sites/SiteTable";
import SiteCard from "../../components/sites/SiteCard";

function Sites() {
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
        <SiteCard
          siteName="Site A"
          location="Mumbai"
          totalExpense="2,50,000"
        />

        <SiteCard
          siteName="Site B"
          location="Pune"
          totalExpense="1,80,000"
        />

        <SiteCard
          siteName="Site C"
          location="Nashik"
          totalExpense="90,000"
        />
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