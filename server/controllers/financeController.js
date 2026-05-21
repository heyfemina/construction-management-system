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

      const clients =
        await pool.query(
          `
        SELECT
          c.*,
          COALESCE(r.total_amount, 0)::numeric AS total_receivable,
          COALESCE(r.received_amount, 0)::numeric AS received_amount,
          COALESCE(r.pending_amount, 0)::numeric AS pending_amount,
          COALESCE(p.payment_amount, 0)::numeric AS payment_received
        FROM clients c
        LEFT JOIN (
          SELECT
            client_id,
            SUM(total_amount) AS total_amount,
            SUM(received_amount) AS received_amount,
            SUM(pending_amount) AS pending_amount
          FROM receivables
          WHERE user_id = $1
          GROUP BY client_id
        ) r ON r.client_id = c.id
        LEFT JOIN (
          SELECT client_id, SUM(payment_amount) AS payment_amount
          FROM payments
          WHERE user_id = $1
          GROUP BY client_id
        ) p ON p.client_id = c.id
        WHERE c.user_id = $1
        ORDER BY c.id DESC
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
        clients: clients.rows,
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

    const paymentAmount = Number(payment_amount || 0);

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
          paymentAmount,
          payment_date,
          payment_method,
          notes,
          req.user.id,
        ]
      );

    if (client_id && paymentAmount > 0) {
      await pool.query(
        `
        WITH open_receivables AS (
          SELECT
            id,
            pending_amount,
            COALESCE(
              SUM(pending_amount) OVER (
                ORDER BY due_date NULLS LAST, id
                ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
              ),
              0
            ) AS previous_pending
          FROM receivables
          WHERE client_id = $1
            AND user_id = $2
            AND pending_amount > 0
        ),
        allocations AS (
          SELECT
            id,
            LEAST(
              pending_amount,
              GREATEST(0, $3::numeric - previous_pending)
            ) AS allocated_amount
          FROM open_receivables
        )
        UPDATE receivables r
        SET
          received_amount = r.received_amount + a.allocated_amount,
          pending_amount = r.pending_amount - a.allocated_amount
        FROM allocations a
        WHERE r.id = a.id
          AND a.allocated_amount > 0
        `,
        [client_id, req.user.id, paymentAmount]
      );
    }

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

export const getPartyLedger = async (req, res) => {
  try {
    const { clientId } = req.params;

    const party = await pool.query(
      `
      SELECT
        c.*,
        COALESCE(r.total_amount, 0)::numeric AS total_receivable,
        COALESCE(r.received_amount, 0)::numeric AS received_amount,
        COALESCE(r.pending_amount, 0)::numeric AS pending_amount,
        COALESCE(p.payment_amount, 0)::numeric AS payment_received
      FROM clients c
      LEFT JOIN (
        SELECT
          client_id,
          SUM(total_amount) AS total_amount,
          SUM(received_amount) AS received_amount,
          SUM(pending_amount) AS pending_amount
        FROM receivables
        WHERE user_id = $1
        GROUP BY client_id
      ) r ON r.client_id = c.id
      LEFT JOIN (
        SELECT client_id, SUM(payment_amount) AS payment_amount
        FROM payments
        WHERE user_id = $1
        GROUP BY client_id
      ) p ON p.client_id = c.id
      WHERE c.id = $2 AND c.user_id = $1
      `,
      [req.user.id, clientId]
    );

    if (!party.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Party not found",
      });
    }

    const transactions = await pool.query(
      `
      SELECT
        r.id,
        r.due_date AS transaction_date,
        'Receivable' AS type,
        s.site_name AS description,
        r.total_amount AS debit,
        r.received_amount AS received,
        r.pending_amount AS pending,
        0::numeric AS credit
      FROM receivables r
      LEFT JOIN sites s ON s.id = r.site_id
      WHERE r.client_id = $2 AND r.user_id = $1

      UNION ALL

      SELECT
        p.id,
        p.payment_date AS transaction_date,
        'Payment' AS type,
        COALESCE(NULLIF(p.payment_method, ''), p.notes, 'Payment') AS description,
        0::numeric AS debit,
        p.payment_amount AS received,
        0::numeric AS pending,
        p.payment_amount AS credit
      FROM payments p
      WHERE p.client_id = $2 AND p.user_id = $1

      ORDER BY transaction_date DESC NULLS LAST, id DESC
      `,
      [req.user.id, clientId]
    );

    res.status(200).json({
      success: true,
      party: party.rows[0],
      transactions: transactions.rows,
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
      receivedPayments,
      materialCosts,
      labourCosts,
      labourPaid,
      vendorPending,
      labourPending,
      monthlyExpenses,
      monthlyMaterials,
    ] =
      await Promise.all([
        pool.query("SELECT COUNT(*)::int AS count FROM sites WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM vendors WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM labours WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM materials WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM expenses WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(pending_amount), 0)::numeric AS total FROM receivables WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(payment_amount), 0)::numeric AS total FROM payments WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(total_cost), 0)::numeric AS total FROM material_purchases WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(total_amount), 0)::numeric AS total FROM wages WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(paid_amount), 0)::numeric AS total FROM labour_payments WHERE user_id = $1", [userId]),
        pool.query(`
          SELECT
            COALESCE(p.purchase_total, 0) -
            COALESCE(pay.paid_total, 0) AS total
          FROM
            (SELECT COALESCE(SUM(total_cost), 0)::numeric AS purchase_total FROM material_purchases WHERE user_id = $1) p,
            (SELECT COALESCE(SUM(paid_amount), 0)::numeric AS paid_total FROM vendor_payments WHERE user_id = $1) pay
        `, [userId]),
        pool.query(`
          SELECT
            COALESCE(w.wage_total, 0) -
            COALESCE(pay.paid_total, 0) AS total
          FROM
            (SELECT COALESCE(SUM(total_amount), 0)::numeric AS wage_total FROM wages WHERE user_id = $1) w,
            (SELECT COALESCE(SUM(paid_amount), 0)::numeric AS paid_total FROM labour_payments WHERE user_id = $1) pay
        `, [userId]),
        pool.query(`
          SELECT
            TO_CHAR(DATE_TRUNC('month', expense_date), 'Mon YYYY') AS month,
            DATE_TRUNC('month', expense_date) AS month_start,
            COALESCE(SUM(amount), 0)::numeric AS expense
          FROM expenses
          WHERE user_id = $1
          GROUP BY DATE_TRUNC('month', expense_date)
          ORDER BY month_start
        `, [userId]),
        pool.query(`
          SELECT
            TO_CHAR(DATE_TRUNC('month', purchase_date), 'Mon YYYY') AS month,
            DATE_TRUNC('month', purchase_date) AS month_start,
            COALESCE(SUM(total_cost), 0)::numeric AS materials
          FROM material_purchases
          WHERE user_id = $1
          GROUP BY DATE_TRUNC('month', purchase_date)
          ORDER BY month_start
        `, [userId]),
      ]);

    const pendingVendorPayments = Number(vendorPending.rows[0].total);
    const pendingLabourPayments = Number(labourPending.rows[0].total);
    const totalLabourCosts = Number(labourCosts.rows[0].total);
    const paidLabourCosts = Number(labourPaid.rows[0].total);

    res.status(200).json({
      success: true,
      summary: {
        totalSites: sites.rows[0].count,
        totalVendors: vendors.rows[0].count,
        totalWorkers: labours.rows[0].count,
        totalMaterials: materials.rows[0].count,
        totalExpenses: Number(expenses.rows[0].total),
        pendingReceivables: Number(receivables.rows[0].total),
        receivedPayments: Number(receivedPayments.rows[0].total),
        materialCosts: Number(materialCosts.rows[0].total),
        labourCosts: totalLabourCosts,
        paidLabourCosts,
        pendingLabourPayments,
        pendingVendorPayments,
        pendingPayments: pendingVendorPayments + pendingLabourPayments,
        monthlyExpenses: monthlyExpenses.rows.map((row) => ({
          month: row.month,
          expense: Number(row.expense),
        })),
        monthlyMaterials: monthlyMaterials.rows.map((row) => ({
          month: row.month,
          materials: Number(row.materials),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
