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
        payment_amount: 1000,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "Cash",
        notes: "Smoke test payment",
      }),
    },
    token
  );

  const checks = await Promise.all([
    request("/materials", {}, token),
    request("/vendors", {}, token),
    request("/labours", {}, token),
    request("/finance", {}, token),
    request("/finance/summary", {}, token),
    request("/sites", {}, token),
  ]);

  console.log(
    JSON.stringify(
      {
        success: true,
        counts: {
          materials: checks[0].materials.length,
          vendors: checks[1].vendors.length,
          labours: checks[2].labours.length,
          expenses: checks[3].expenses.length,
          sites: checks[5].sites.length,
        },
        summary: checks[4].summary,
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
