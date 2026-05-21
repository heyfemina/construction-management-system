import pool from "../config/db.js";
import { sendPaymentConfirmationEmail } from "../services/emailService.js";

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

export const addLabourPayment = async (req, res) => {
  try {
    const {
      labour_id,
      total_amount,
      paid_amount,
      pending_amount,
      payment_date,
      payment_method,
      recipient_email,
    } = req.body;

    if (!recipient_email) {
      return res.status(400).json({
        success: false,
        message: "Recipient email is required",
      });
    }

    const labour = labour_id
      ? await pool.query(
          `
          SELECT labour_name
          FROM labours
          WHERE id = $1 AND user_id = $2
          `,
          [labour_id, req.user.id]
        )
      : { rows: [] };

    const result = await pool.query(
      `
      INSERT INTO labour_payments
      (labour_id, total_amount, paid_amount, pending_amount, payment_date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        labour_id || null,
        total_amount,
        paid_amount || total_amount,
        pending_amount || 0,
        payment_date || null,
        req.user.id,
      ]
    );

    let email = {
      sent: false,
      skipped: true,
      reason: "Email notification was not attempted",
    };

    try {
      email = await sendPaymentConfirmationEmail({
        to: recipient_email,
        recipientName: labour.rows[0]?.labour_name,
        recipientType: "Labour",
        amount: result.rows[0].paid_amount,
        totalAmount: result.rows[0].total_amount,
        pendingAmount: result.rows[0].pending_amount,
        paymentDate: result.rows[0].payment_date,
        paymentMethod: payment_method,
        reference: `Labour Payment #${result.rows[0].id}`,
      });
    } catch (emailError) {
      email = {
        sent: false,
        error: emailError.message,
      };
    }

    res.status(201).json({
      success: true,
      payment: result.rows[0],
      email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
