const baseUrl = "http://localhost:5000/api";
const stamp = Date.now();
const email = `smoke-${stamp}@example.com`;
const password = "SmokeTest123!";

const request = async (path, options = {}, token = "") => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`${path}: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
};

const run = async () => {
  const register = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Smoke Tester",
      email,
      password,
    }),
  });

  const token = register.token;

  const site = await request(
    "/sites",
    {
      method: "POST",
      body: JSON.stringify({
        site_name: `Smoke Site ${stamp}`,
        location: "Test Location",
        description: "Smoke test site",
      }),
    },
    token
  );

  const vendor = await request(
    "/vendors",
    {
      method: "POST",
      body: JSON.stringify({
        vendor_name: `Smoke Vendor ${stamp}`,
        contact_number: "9999999999",
        email: `vendor-${stamp}@example.com`,
        address: "Test Address",
      }),
    },
    token
  );

  await request(
    `/vendors/${vendor.vendor.id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        vendor_name: `${vendor.vendor.vendor_name} Updated`,
        contact_number: "9999999999",
        email: `vendor-${stamp}@example.com`,
        address: "Test Address",
      }),
    },
    token
  );

  const material = await request(
    "/materials",
    {
      method: "POST",
      body: JSON.stringify({
        site_id: site.site.id,
        material_name: `Smoke Cement ${stamp}`,
        unit: "bag",
      }),
    },
    token
  );

  await request(
    `/materials/${material.material.id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        site_id: site.site.id,
        material_name: `${material.material.material_name} Updated`,
        unit: "bag",
      }),
    },
    token
  );

  await request(
    "/materials/purchases",
    {
      method: "POST",
      body: JSON.stringify({
        material_id: material.material.id,
        vendor_id: vendor.vendor.id,
        site_id: site.site.id,
        quantity: 10,
        unit_cost: 250,
        transport_cost: 100,
        total_cost: 2600,
        purchase_date: new Date().toISOString().slice(0, 10),
      }),
    },
    token
  );

  await request(
    "/materials/usage",
    {
      method: "POST",
      body: JSON.stringify({
        material_id: material.material.id,
        site_id: site.site.id,
        used_quantity: 2,
        usage_date: new Date().toISOString().slice(0, 10),
      }),
    },
    token
  );

  const labour = await request(
    "/labours",
    {
      method: "POST",
      body: JSON.stringify({
        site_id: site.site.id,
        labour_name: `Smoke Labour ${stamp}`,
        contact_number: "8888888888",
        address: "Test Address",
        daily_wage: 600,
      }),
    },
    token
  );

  await request(
    `/labours/${labour.labour.id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        site_id: site.site.id,
        labour_name: `${labour.labour.labour_name} Updated`,
        contact_number: "8888888888",
        address: "Test Address",
        daily_wage: 650,
      }),
    },
    token
  );

  await request(
    "/labours/attendance",
    {
      method: "POST",
      body: JSON.stringify({
        labour_id: labour.labour.id,
        site_id: site.site.id,
        attendance_date: new Date().toISOString().slice(0, 10),
        status: "Present",
      }),
    },
    token
  );

  await request(
    "/labours/wages",
    {
      method: "POST",
      body: JSON.stringify({
        labour_id: labour.labour.id,
        total_days: 1,
        rate_per_day: 600,
        total_amount: 600,
        wage_month: new Date().toISOString().slice(0, 7),
      }),
    },
    token
  );

  await request(
    "/labours/payments",
    {
      method: "POST",
      body: JSON.stringify({
        labour_id: labour.labour.id,
        total_amount: 600,
        paid_amount: 600,
        pending_amount: 0,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "Cash",
        recipient_email: `labour-${stamp}@example.com`,
      }),
    },
    token
  );

  await request(
    "/finance/receivables",
    {
      method: "POST",
      body: JSON.stringify({
        client_name: `Smoke Client ${stamp}`,
        site_id: site.site.id,
        total_amount: 10000,
        received_amount: 2000,
        pending_amount: 8000,
        due_date: new Date().toISOString().slice(0, 10),
      }),
    },
    token
  );

  const financeAfterReceivable = await request("/finance", {}, token);
  const clientId = financeAfterReceivable.clients.find((client) =>
    client.client_name?.includes(`Smoke Client ${stamp}`)
  )?.id;

  await request(
    "/finance/expenses",
    {
      method: "POST",
      body: JSON.stringify({
        site_id: site.site.id,
        expense_type: "Smoke Expense",
        amount: 500,
        expense_date: new Date().toISOString().slice(0, 10),
        description: "Smoke test expense",
      }),
    },
    token
  );

  await request(
    "/finance/payments",
    {
      method: "POST",
      body: JSON.stringify({
        client_id: clientId,
        payment_amount: 1000,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "Cash",
        notes: "Smoke test payment",
      }),
    },
    token
  );

  await request(
    "/vendors/payments",
    {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendor.vendor.id,
        total_amount: 2600,
        paid_amount: 1000,
        pending_amount: 1600,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "Cash",
        recipient_email: `vendor-${stamp}@example.com`,
      }),
    },
    token
  );

  const checks = await Promise.all([
    request("/materials", {}, token),
    request(`/materials/${material.material.id}`, {}, token),
    request("/vendors", {}, token),
    request(`/vendors/${vendor.vendor.id}`, {}, token),
    request(`/vendors/ledger/${vendor.vendor.id}`, {}, token),
    request("/labours", {}, token),
    request(`/labours/${labour.labour.id}`, {}, token),
    request(`/labours/ledger/${labour.labour.id}`, {}, token),
    request("/labours/activity", {}, token),
    request("/finance", {}, token),
    request(`/finance/ledger/${clientId}`, {}, token),
    request("/finance/summary", {}, token),
    request(`/sites/report/${site.site.id}`, {}, token),
    request("/sites", {}, token),
    request(`/sites/${site.site.id}`, {}, token),
  ]);

  console.log(
    JSON.stringify(
      {
        success: true,
        counts: {
        materials: checks[0].materials.length,
          vendors: checks[2].vendors.length,
          vendorLedgerTransactions: checks[4].transactions.length,
          labours: checks[5].labours.length,
          labourLedgerTransactions: checks[7].transactions.length,
          dailyLabourReports: checks[8].summaries.daily.length,
          weeklyLabourReports: checks[8].summaries.weekly.length,
          monthlyLabourReports: checks[8].summaries.monthly.length,
          expenses: checks[9].expenses.length,
          partyLedgerTransactions: checks[10].transactions.length,
          siteMaterials: checks[12].materials.length,
          siteLabours: checks[12].labours.length,
          siteVendors: checks[12].vendors.length,
          siteExpenses: checks[12].expenses.length,
          sites: checks[13].sites.length,
        },
        detailChecks: {
          material: checks[1].material.material_name,
          vendor: checks[3].vendor.vendor_name,
          vendorLedgerPending: checks[4].vendor.pending_amount,
          vendorLedgerFirstType: checks[4].transactions[0]?.type,
          labour: checks[6].labour.labour_name,
          labourLedgerPending: checks[7].labour.pending_amount,
          labourLedgerFirstType: checks[7].transactions[0]?.type,
          partyLedgerPending: checks[10].party.pending_amount,
          partyLedgerFirstType: checks[10].transactions[0]?.type,
          siteReport: checks[12].site.site_name,
          site: checks[14].site.site_name,
        },
        summary: checks[11].summary,
        dashboardChecks: {
          pendingPayments: checks[11].summary.pendingPayments,
          materialCosts: checks[11].summary.materialCosts,
          labourCosts: checks[11].summary.labourCosts,
          monthlyExpenses: checks[11].summary.monthlyExpenses.length,
          monthlyMaterials: checks[11].summary.monthlyMaterials.length,
        },
      },
      null,
      2
    )
  );
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
