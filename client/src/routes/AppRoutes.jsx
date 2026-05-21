import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/dashboard/Dashboard";

import Materials from "../pages/materials/Materials";
import AddMaterial from "../pages/materials/AddMaterial";
import EditMaterial from "../pages/materials/EditMaterial";
import MaterialDetails from "../pages/materials/MaterialDetails";
import StockManagement from "../pages/materials/StockManagement";

import Vendors from "../pages/vendors/Vendors";
import AddVendor from "../pages/vendors/AddVendor";
import VendorDetails from "../pages/vendors/VendorDetails";
import VendorLedgerPage from "../pages/vendors/VendorLedgerPage";

import Labour from "../pages/labour/Labour";
import Attendance from "../pages/labour/Attendance";
import WageManagement from "../pages/labour/WageManagement";
import LabourLedgerPage from "../pages/labour/LabourLedgerPage";

import Finance from "../pages/finance/Finance";
import Receivables from "../pages/finance/Receivables";
import Expenses from "../pages/finance/Expenses";
import Payments from "../pages/finance/Payments";

import MaterialReports from "../pages/reports/MaterialReports";
import VendorReports from "../pages/reports/VendorReports";
import LabourReports from "../pages/reports/LabourReports";
import FinancialReports from "../pages/reports/FinancialReports";
import SiteReports from "../pages/reports/SiteReports";

import Sites from "../pages/sites/Sites";
import AddSite from "../pages/sites/AddSite";
import SiteDetails from "../pages/sites/SiteDetails";

function AppRoutes() {
  const authPage = (page) => (
    <PublicRoute>
      <AuthLayout>{page}</AuthLayout>
    </PublicRoute>
  );

  const privatePage = (page) => (
    <PrivateRoute>
      <DashboardLayout>{page}</DashboardLayout>
    </PrivateRoute>
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES */}

        <Route path="/login" element={authPage(<Login />)} />

        <Route path="/register" element={authPage(<Register />)} />

        <Route
          path="/forgot-password"
          element={authPage(<ForgotPassword />)}
        />

        {/* DASHBOARD */}

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={privatePage(<Dashboard />)}
        />

        {/* MATERIAL ROUTES */}

        <Route
          path="/materials"
          element={privatePage(<Materials />)}
        />

        <Route
          path="/materials/add"
          element={privatePage(<AddMaterial />)}
        />

        <Route
          path="/materials/edit/:id"
          element={privatePage(<EditMaterial />)}
        />

        <Route
          path="/materials/details/:id"
          element={privatePage(<MaterialDetails />)}
        />

        <Route
          path="/stock-management"
          element={privatePage(<StockManagement />)}
        />

        {/* VENDOR ROUTES */}

        <Route
          path="/vendors"
          element={privatePage(<Vendors />)}
        />

        <Route
          path="/vendors/add"
          element={privatePage(<AddVendor />)}
        />

        <Route
          path="/vendors/details/:id"
          element={privatePage(<VendorDetails />)}
        />

        <Route
          path="/vendors/ledger"
          element={privatePage(<VendorLedgerPage />)}
        />

        {/* LABOUR ROUTES */}

        <Route
          path="/labour"
          element={privatePage(<Labour />)}
        />

        <Route
          path="/attendance"
          element={privatePage(<Attendance />)}
        />

        <Route
          path="/wage-management"
          element={privatePage(<WageManagement />)}
        />

        <Route
          path="/labour-ledger"
          element={privatePage(<LabourLedgerPage />)}
        />

        {/* FINANCE ROUTES */}

        <Route
          path="/finance"
          element={privatePage(<Finance />)}
        />

        <Route
          path="/receivables"
          element={privatePage(<Receivables />)}
        />

        <Route
          path="/expenses"
          element={privatePage(<Expenses />)}
        />

        <Route
          path="/payments"
          element={privatePage(<Payments />)}
        />

        {/* REPORT ROUTES */}

        <Route
          path="/reports"
          element={<Navigate to="/reports/materials" replace />}
        />

        <Route
          path="/reports/materials"
          element={privatePage(<MaterialReports />)}
        />

        <Route
          path="/reports/vendors"
          element={privatePage(<VendorReports />)}
        />

        <Route
          path="/reports/labours"
          element={privatePage(<LabourReports />)}
        />

        <Route
          path="/reports/financial"
          element={privatePage(<FinancialReports />)}
        />

        <Route
          path="/reports/sites"
          element={privatePage(<SiteReports />)}
        />

        {/* SITE ROUTES */}

        <Route
          path="/sites"
          element={privatePage(<Sites />)}
        />

        <Route
          path="/sites/add"
          element={privatePage(<AddSite />)}
        />

        <Route
          path="/sites/details/:id"
          element={privatePage(<SiteDetails />)}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
