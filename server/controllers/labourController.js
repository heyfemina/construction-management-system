import pool from "../config/db.js";

export const getLabours =
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
        SELECT
          l.*,
          s.site_name,
          COALESCE(a.attendance_count, 0)::int AS attendance_count,
          COALESCE(w.total_wage, 0)::numeric AS total_wage,
          COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
          (
            COALESCE(w.total_wage, 0) -
            COALESCE(pay.paid_amount, 0)
          )::numeric AS pending_amount
        FROM labours l
        LEFT JOIN sites s ON s.id = l.site_id
        LEFT JOIN (
          SELECT labour_id, COUNT(*) AS attendance_count
          FROM attendance
          WHERE user_id = $1
          GROUP BY labour_id
        ) a ON a.labour_id = l.id
        LEFT JOIN (
          SELECT labour_id, SUM(total_amount) AS total_wage
          FROM wages
          WHERE user_id = $1
          GROUP BY labour_id
        ) w ON w.labour_id = l.id
        LEFT JOIN (
          SELECT labour_id, SUM(paid_amount) AS paid_amount
          FROM labour_payments
          WHERE user_id = $1
          GROUP BY labour_id
        ) pay ON pay.labour_id = l.id
        WHERE l.user_id = $1
        ORDER BY l.id DESC
        `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        labours: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addLabour = async (
  req,
  res
) => {
  try {
    const {
      site_id,
      labour_name,
      contact_number,
      address,
      daily_wage,
    } = req.body;

    const result =
      await pool.query(
        `
      INSERT INTO labours
      (
        site_id,
        labour_name,
        contact_number,
        address,
        daily_wage,
        user_id
      )

      VALUES ($1, $2, $3, $4, $5, $6)

      RETURNING *
      `,
        [
          site_id,
          labour_name,
          contact_number,
          address,
          daily_wage,
          req.user.id,
        ]
      );

    res.status(201).json({
      success: true,
      labour: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleLabour = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        l.*,
        s.site_name,
        COALESCE(a.attendance_count, 0)::int AS attendance_count,
        COALESCE(w.total_wage, 0)::numeric AS total_wage,
        COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
        (
          COALESCE(w.total_wage, 0) -
          COALESCE(pay.paid_amount, 0)
        )::numeric AS pending_amount
      FROM labours l
      LEFT JOIN sites s ON s.id = l.site_id
      LEFT JOIN (
        SELECT labour_id, COUNT(*) AS attendance_count
        FROM attendance
        WHERE user_id = $1
        GROUP BY labour_id
      ) a ON a.labour_id = l.id
      LEFT JOIN (
        SELECT labour_id, SUM(total_amount) AS total_wage
        FROM wages
        WHERE user_id = $1
        GROUP BY labour_id
      ) w ON w.labour_id = l.id
      LEFT JOIN (
        SELECT labour_id, SUM(paid_amount) AS paid_amount
        FROM labour_payments
        WHERE user_id = $1
        GROUP BY labour_id
      ) pay ON pay.labour_id = l.id
      WHERE l.id = $2 AND l.user_id = $1
      `,
      [req.user.id, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Labour not found",
      });
    }

    res.status(200).json({
      success: true,
      labour: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLabour = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      site_id,
      labour_name,
      contact_number,
      address,
      daily_wage,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE labours
      SET site_id = $1,
          labour_name = $2,
          contact_number = $3,
          address = $4,
          daily_wage = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
      `,
      [
        site_id || null,
        labour_name,
        contact_number || "",
        address || "",
        daily_wage,
        id,
        req.user.id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Labour not found",
      });
    }

    res.status(200).json({
      success: true,
      labour: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLabour =
  async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        `
      DELETE FROM labours
      WHERE id = $1 AND user_id = $2
      `,
        [id, req.user.id]
      );

      res.status(200).json({
        success: true,
        message: "Labour deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getLabourActivity =
  async (req, res) => {
    try {
      const search = String(req.query.search || "").trim();

      const attendance =
        await pool.query(
          `
          SELECT
            a.*,
            l.labour_name,
            s.site_name
          FROM attendance a
          LEFT JOIN labours l ON l.id = a.labour_id
          LEFT JOIN sites s ON s.id = a.site_id
          WHERE a.user_id = $1
            AND (
              $2 = ''
              OR l.labour_name ILIKE '%' || $2 || '%'
            )
          ORDER BY a.attendance_date DESC, a.id DESC
          `,
          [req.user.id, search]
        );

      const wages =
        await pool.query(
          `
          SELECT
            w.*,
            l.labour_name
          FROM wages w
          LEFT JOIN labours l ON l.id = w.labour_id
          WHERE w.user_id = $1
          ORDER BY w.created_at DESC, w.id DESC
          `,
          [req.user.id]
        );

      const payments =
        await pool.query(
          `
          SELECT
            p.*,
            l.labour_name
          FROM labour_payments p
          LEFT JOIN labours l ON l.id = p.labour_id
          WHERE p.user_id = $1
          ORDER BY p.payment_date DESC NULLS LAST, p.id DESC
          `,
          [req.user.id]
        );

      const dailySummary =
        await pool.query(
          `
          SELECT
            a.attendance_date AS period_start,
            COUNT(DISTINCT a.labour_id)::int AS worker_count
          FROM attendance a
          WHERE a.user_id = $1
            AND LOWER(COALESCE(a.status, 'present')) = 'present'
          GROUP BY a.attendance_date
          ORDER BY a.attendance_date DESC
          `,
          [req.user.id]
        );

      const weeklySummary =
        await pool.query(
          `
          SELECT
            DATE_TRUNC('week', a.attendance_date)::date AS period_start,
            COUNT(DISTINCT a.labour_id)::int AS worker_count
          FROM attendance a
          WHERE a.user_id = $1
            AND LOWER(COALESCE(a.status, 'present')) = 'present'
          GROUP BY DATE_TRUNC('week', a.attendance_date)::date
          ORDER BY period_start DESC
          `,
          [req.user.id]
        );

      const monthlySummary =
        await pool.query(
          `
          SELECT
            DATE_TRUNC('month', a.attendance_date)::date AS period_start,
            COUNT(DISTINCT a.labour_id)::int AS worker_count
          FROM attendance a
          WHERE a.user_id = $1
            AND LOWER(COALESCE(a.status, 'present')) = 'present'
          GROUP BY DATE_TRUNC('month', a.attendance_date)::date
          ORDER BY period_start DESC
          `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        attendance: attendance.rows,
        wages: wages.rows,
        payments: payments.rows,
        summaries: {
          daily: dailySummary.rows,
          weekly: weeklySummary.rows,
          monthly: monthlySummary.rows,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getLabourLedger =
  async (req, res) => {
    try {
      const { id } = req.params;

      const labour = await pool.query(
        `
        SELECT
          l.*,
          s.site_name,
          COALESCE(w.total_wage, 0)::numeric AS total_wage,
          COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
          (
            COALESCE(w.total_wage, 0) -
            COALESCE(pay.paid_amount, 0)
          )::numeric AS pending_amount
        FROM labours l
        LEFT JOIN sites s ON s.id = l.site_id
        LEFT JOIN (
          SELECT labour_id, SUM(total_amount) AS total_wage
          FROM wages
          WHERE user_id = $1
          GROUP BY labour_id
        ) w ON w.labour_id = l.id
        LEFT JOIN (
          SELECT labour_id, SUM(paid_amount) AS paid_amount
          FROM labour_payments
          WHERE user_id = $1
          GROUP BY labour_id
        ) pay ON pay.labour_id = l.id
        WHERE l.id = $2 AND l.user_id = $1
        `,
        [req.user.id, id]
      );

      if (!labour.rows[0]) {
        return res.status(404).json({
          success: false,
          message: "Labour not found",
        });
      }

      const transactions = await pool.query(
        `
        SELECT
          w.id,
          COALESCE(
            TO_DATE(NULLIF(w.wage_month, ''), 'YYYY-MM'),
            w.created_at::date
          ) AS transaction_date,
          'Wage' AS type,
          CONCAT(w.total_days, ' day(s) @ ', w.rate_per_day) AS description,
          w.total_days,
          w.rate_per_day,
          w.total_amount AS debit,
          0::numeric AS credit
        FROM wages w
        WHERE w.labour_id = $2 AND w.user_id = $1

        UNION ALL

        SELECT
          p.id,
          p.payment_date AS transaction_date,
          'Payment' AS type,
          COALESCE(NULLIF(p.payment_method, ''), 'Payment') AS description,
          NULL::integer AS total_days,
          NULL::numeric AS rate_per_day,
          0::numeric AS debit,
          p.paid_amount AS credit
        FROM labour_payments p
        WHERE p.labour_id = $2 AND p.user_id = $1

        ORDER BY transaction_date DESC NULLS LAST, id DESC
        `,
        [req.user.id, id]
      );

      res.status(200).json({
        success: true,
        labour: labour.rows[0],
        transactions: transactions.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addAttendance = async (req, res) => {
  try {
    const {
      labour_id,
      site_id,
      attendance_date,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO attendance
      (labour_id, site_id, attendance_date, status, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        labour_id || null,
        site_id || null,
        attendance_date,
        status || "Present",
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      attendance: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addWage = async (req, res) => {
  try {
    const {
      labour_id,
      total_days,
      rate_per_day,
      total_amount,
      wage_month,
    } = req.body;

    const days = Number(total_days || 0);
    const rate = Number(rate_per_day || 0);
    const calculatedTotal =
      total_amount === undefined || total_amount === ""
        ? days * rate
        : Number(total_amount);

    const result = await pool.query(
      `
      INSERT INTO wages
      (labour_id, total_days, rate_per_day, total_amount, wage_month, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        labour_id || null,
        days,
        rate,
        calculatedTotal,
        wage_month || "",
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      wage: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addLabourPayment = async (req, res) => {
  try {
    const {
      labour_id,
      total_amount,
      paid_amount,
      pending_amount,
      payment_date,
      payment_method,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO labour_payments
      (labour_id, total_amount, paid_amount, pending_amount, payment_date, payment_method, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        labour_id || null,
        Number(total_amount || 0),
        Number(paid_amount || 0),
        pending_amount === undefined || pending_amount === ""
          ? Number(total_amount || 0) - Number(paid_amount || 0)
          : Number(pending_amount),
        payment_date || null,
        payment_method || "",
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
