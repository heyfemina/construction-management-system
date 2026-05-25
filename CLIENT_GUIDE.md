# Construction Management System - Client Guide

## Purpose

This software helps a construction business manage sites, materials, vendors, labour, payments, receivables, expenses, reports, and dashboard summaries from one admin panel.

The main idea is simple:

1. Create construction sites.
2. Add vendors, labour, materials, parties, and expenses.
3. Record purchases, attendance, usage, payments, and received amounts.
4. Use ledgers, reports, exports, and dashboard charts to understand the full business position.

## Daily Workflow

1. Login as admin.
2. Add or select the construction site you are working on.
3. Add materials such as Cement, Sand, Steel, Bricks, etc.
4. Add vendors and record material purchases from them.
5. Add labour workers and mark daily attendance.
6. Record labour wages and payments.
7. Add client or party receivables and payment received entries.
8. Check dashboard, ledgers, and reports to review pending payments, total expenses, material cost, and labour cost.

## Material Management

Use this module to manage all construction materials.

- Add materials with name, unit, quantity, cost per unit, and transport charges.
- Track total material cost automatically.
- Assign material records to a specific construction site.
- Record used quantity so the system can show remaining stock.
- View material-wise and site-wise reports.
- Export reports when required.

How it helps:

- The owner can know how much material came to each site.
- The owner can see how much material is used and how much is remaining.
- Material cost and transport cost are included in total expense tracking.

## Vendor Management

Use this module to manage suppliers and vendor payments.

- Add vendor profile with name, contact number, email, and address.
- Record purchases made from each vendor.
- Track purchase date, material, quantity, and total amount.
- Add payments made to vendors.
- View pending amount, paid amount, and full vendor ledger.
- Export a single vendor report as PDF or Excel.

How pending amount works:

- Vendor pending amount = Total purchases from vendor - Total payments made to vendor.

Note:

- Vendor email is saved as profile information only. Automatic email sending is not enabled.

## Labour Management

Use this module to manage labour workers, attendance, wages, and payments.

- Add labour profile with basic details.
- Mark daily attendance.
- Enter number of working days or attendance entries.
- Set per-day wage rate.
- Total labour amount is calculated automatically.
- Add labour payments.
- View paid amount, pending dues, and individual labour ledger.
- Check daily, weekly, and monthly labour reports.

How pending amount works:

- Labour pending amount = Total wage amount - Total payments made to labour.

## Financial And Party Management

Use this module to track money receivable from clients or parties.

- Add party or client details.
- Add receivable amount.
- Record payment received.
- View party-wise ledger.
- Track pending receivable amount.
- Check financial overview from the dashboard.

How pending receivable works:

- Party pending amount = Total receivable amount - Total received amount.

## Multi-Site Management

Use this module when the business has more than one construction site.

- Create separate sites.
- Track materials site-wise.
- Track labour site-wise.
- Track vendors site-wise.
- Track expenses site-wise.
- Generate separate site reports.

Best practice:

- Always select the correct site while adding material, labour, purchase, payment, or expense entries. This keeps reports accurate.

## Reports And Export

Reports are available for key business areas.

- Material reports
- Vendor reports
- Labour reports
- Financial reports
- Site-wise reports
- Ledger reports

Export options:

- PDF
- Excel

Use reports when the owner wants printed records, vendor statements, labour summaries, or site-wise cost details.

## User And Access Control

- Admin can register and login.
- Data is connected with the logged-in account.
- Multiple users and role-based permissions can be added later if required.

Best practice:

- Use one admin account for the owner or main office.
- Do not share the admin password with unnecessary users.

## Dashboard

The dashboard gives a quick business summary.

It shows:

- Total expenses
- Pending payments
- Material costs
- Labour costs
- Financial overview
- Visual charts and summaries

Use the dashboard first when the owner wants a quick understanding of the business position.

## Recommended Client Demo Flow

Use this flow to explain the software to a client:

1. Login as admin.
2. Create one construction site.
3. Add one vendor.
4. Add one material purchase from that vendor.
5. Add one labour worker.
6. Mark labour attendance.
7. Add labour payment.
8. Add one party receivable and one received payment.
9. Open dashboard and show totals.
10. Open vendor ledger, labour ledger, material report, and site report.
11. Export one report as PDF or Excel.

## Important Notes

- Keep site selection correct for accurate site-wise reports.
- Enter payment amounts carefully because ledgers and pending balances are calculated from payment records.
- Material remaining stock depends on received quantity and used quantity.
- Vendor balances depend on purchase and payment records.
- Labour balances depend on attendance, wage, and payment records.
- Party balances depend on receivable and received payment records.
- Automatic email or WhatsApp notification is not enabled.

## Troubleshooting

If a request fails:

- Make sure the backend server is running.
- Make sure the database connection is correct.
- Make sure the admin is logged in.
- Make sure required fields are filled.
- Refresh the page after adding records if the list does not update immediately.

If data is not visible:

- Check that you are logged in with the correct admin account.
- Check that the selected site or filter is correct.
- Check that records were saved successfully.
