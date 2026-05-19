import pool from "../config/db.js";

export const getLabours =
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
        SELECT * FROM labours
        WHERE user_id = $1
        ORDER BY id DESC
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
