import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";

import ensureSchema from "./config/ensureSchema.js";
import authRoutes from "./routes/authRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";
import labourRoutes from "./routes/labourRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/labours", labourRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

try {
  await ensureSchema();
} catch {
  console.log("Schema check skipped until database connection is available");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
