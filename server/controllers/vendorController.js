import pool from "../config/db.js";

export const getVendors =
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
        SELECT * FROM vendors
        WHERE user_id = $1
        ORDER BY id DESC
        `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        vendors: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addVendor = async (
  req,
  res
) => {
  try {
    const {
      vendor_name,
      contact_number,
      email,
      address,
    } = req.body;

    const result =
      await pool.query(
        `
      INSERT INTO vendors
      (vendor_name, contact_number, email, address, user_id)

      VALUES ($1, $2, $3, $4, $5)

      RETURNING *
      `,
        [
          vendor_name,
          contact_number,
          email,
          address,
          req.user.id,
        ]
      );

    res.status(201).json({
      success: true,
      vendor: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVendor =
  async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        `
      DELETE FROM vendors
      WHERE id = $1 AND user_id = $2
      `,
        [id, req.user.id]
      );

      res.status(200).json({
        success: true,
        message: "Vendor deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addVendorPayment = async (req, res) => {
  try {
    const {
      vendor_id,
      total_amount,
      paid_amount,
      pending_amount,
      payment_date,
      payment_method,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO vendor_payments
      (vendor_id, total_amount, paid_amount, pending_amount, payment_date, payment_method, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        vendor_id || null,
        total_amount,
        paid_amount || total_amount,
        pending_amount || 0,
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
