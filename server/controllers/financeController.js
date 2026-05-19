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
        SELECT * FROM receivables
        WHERE user_id = $1
        ORDER BY id DESC
        `,
          [req.user.id]
        );

      const payments =
        await pool.query(
          `
        SELECT * FROM payments
        WHERE user_id = $1
        ORDER BY id DESC
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

    const [sites, vendors, labours, materials, expenses, receivables] =
      await Promise.all([
        pool.query("SELECT COUNT(*)::int AS count FROM sites WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM vendors WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM labours WHERE user_id = $1", [userId]),
        pool.query("SELECT COUNT(*)::int AS count FROM materials WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM expenses WHERE user_id = $1", [userId]),
        pool.query("SELECT COALESCE(SUM(pending_amount), 0)::numeric AS total FROM receivables WHERE user_id = $1", [userId]),
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
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
