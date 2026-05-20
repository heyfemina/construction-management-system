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
          ORDER BY a.attendance_date DESC, a.id DESC
          `,
          [req.user.id]
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

      res.status(200).json({
        success: true,
        attendance: attendance.rows,
        wages: wages.rows,
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

    const result = await pool.query(
      `
      INSERT INTO wages
      (labour_id, total_days, rate_per_day, total_amount, wage_month, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        labour_id || null,
        total_days,
        rate_per_day,
        total_amount,
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
