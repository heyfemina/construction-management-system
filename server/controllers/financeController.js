import pool from "../config/db.js";

export const getFinanceData =
  async (req, res) => {
    try {
      const expenses =
        await pool.query(
          `
        SELECT * FROM expenses
        WHERE user_id = $1
        ORDER BY id DESC
        `,
          [req.user.id]
        );

      const receivables =
        await pool.query(
          `
        SELECT
          r.*,
          c.client_name,
          c.contact_number,
          s.site_name
        FROM receivables r
        LEFT JOIN clients c ON c.id = r.client_id
        LEFT JOIN sites s ON s.id = r.site_id
        WHERE r.user_id = $1
        ORDER BY r.id DESC
        `,
          [req.user.id]
        );

      const payments =
        await pool.query(
          `
        SELECT
          p.*,
          c.client_name
        FROM payments p
        LEFT JOIN clients c ON c.id = p.client_id
        WHERE p.user_id = $1
        ORDER BY p.id DESC
        `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        expenses:
          expenses.rows,
        receivables:
          receivables.rows,
        payments: payments.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addExpense = async (
  req,
  res
) => {
  try {
    const {
      site_id,
      expense_type,
      amount,
      expense_date,
      description,
    } = req.body;

    const result =
      await pool.query(
        `
      INSERT INTO expenses
      (
        site_id,
        expense_type,
        amount,
        expense_date,
        description,
        user_id
      )

      VALUES ($1, $2, $3, $4, $5, $6)

      RETURNING *
      `,
        [
          site_id,
          expense_type,
          amount,
          expense_date,
          description,
          req.user.id,
        ]
      );

    res.status(201).json({
      success: true,
      expense: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addReceivable = async (
  req,
  res
) => {
  try {
    const {
      client_id,
      client_name,
      contact_number,
      email,
      address,
      site_id,
      total_amount,
      received_amount,
      pending_amount,
      due_date,
    } = req.body;

    let resolvedClientId = client_id || null;

    if (!resolvedClientId && client_name) {
      const client =
        await pool.query(
          `
          INSERT INTO clients
          (client_name, contact_number, email, address, user_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
          `,
          [
            client_name,
            contact_number || "",
            email || "",
            address || "",
            req.user.id,
          ]
        );

      resolvedClientId = client.rows[0].id;
    }

    const total = Number(total_amount || 0);
    const received = Number(received_amount || 0);
    const pending =
      pending_amount === undefined ||
      pending_amount === ""
        ? total - received
        : Number(pending_amount);

    const result =
      await pool.query(
        `
        INSERT INTO receivables
        (
          client_id,
          site_id,
          total_amount,
          received_amount,
          pending_amount,
          due_date,
          user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          resolvedClientId,
          site_id || null,
          total,
          received,
          pending,
          due_date || null,
          req.user.id,
        ]
      );

    res.status(201).json({
      success: true,
      receivable: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addPayment = async (
  req,
  res
) => {
  try {
    const {
      client_id,
      payment_amount,
      payment_date,
      payment_method,
      notes,
    } = req.body;

    const result =
      await pool.query(
        `
      INSERT INTO payments
      (
        client_id,
        payment_amount,
        payment_date,
        payment_method,
        notes,
        user_id
      )

      VALUES ($1, $2, $3, $4, $5, $6)

      RETURNING *
      `,
        [
          client_id || null,
          payment_amount,
          payment_date,
          payment_method,
          notes,
          req.user.id,
        ]
      );

    res.status(201).json({
      success: true,
      payment: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardSummary = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const [
      sites,
      vendors,
      labours,
      materials,
      expenses,
      receivables,
      materialCosts,
      labourCosts,
      vendorPending,
    ] =
      await Promise.all([
        pool.query("SELECT COUNT(*)::int AS count FROM sites WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM vendors WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM labours WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM materials WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM expenses WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(pending_amount), 0)::numeric AS total FROM receivables WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(total_cost), 0)::numeric AS total FROM material_purchases WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(total_amount), 0)::numeric AS total FROM wages WHERE user_id = $1", [userId]),
        pool.query(`
          SELECT
            COALESCE(p.purchase_total, 0) -
            COALESCE(pay.paid_total, 0) AS total
          FROM
            (SELECT COALESCE(SUM(total_cost), 0)::numeric AS purchase_total FROM material_purchases WHERE user_id = $1) p,
            (SELECT COALESCE(SUM(paid_amount), 0)::numeric AS paid_total FROM vendor_payments WHERE user_id = $1) pay
        `, [userId]),
      ]);

    res.status(200).json({
      success: true,
      summary: {
        totalSites: sites.rows[0].count,
        totalVendors: vendors.rows[0].count,
        totalWorkers: labours.rows[0].count,
        totalMaterials: materials.rows[0].count,
        totalExpenses: Number(expenses.rows[0].total),
        pendingReceivables: Number(receivables.rows[0].total),
        materialCosts: Number(materialCosts.rows[0].total),
        labourCosts: Number(labourCosts.rows[0].total),
        pendingVendorPayments: Number(vendorPending.rows[0].total),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
