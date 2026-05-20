import pool from "../config/db.js";

export const getVendors =
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
        SELECT
          v.*,
          COALESCE(p.total_purchase, 0)::numeric AS total_purchase,
          COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
          (
            COALESCE(p.total_purchase, 0) -
            COALESCE(pay.paid_amount, 0)
          )::numeric AS pending_amount
        FROM vendors v
        LEFT JOIN (
          SELECT vendor_id, SUM(total_cost) AS total_purchase
          FROM material_purchases
          WHERE user_id = $1
          GROUP BY vendor_id
        ) p ON p.vendor_id = v.id
        LEFT JOIN (
          SELECT vendor_id, SUM(paid_amount) AS paid_amount
          FROM vendor_payments
          WHERE user_id = $1
          GROUP BY vendor_id
        ) pay ON pay.vendor_id = v.id
        WHERE v.user_id = $1
        ORDER BY v.id DESC
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

export const getVendorLedger =
  async (req, res) => {
    try {
      const { id } = req.params;

      const vendor =
        await pool.query(
          `
          SELECT
            v.*,
            COALESCE(p.total_purchase, 0)::numeric AS total_purchase,
            COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
            (
              COALESCE(p.total_purchase, 0) -
              COALESCE(pay.paid_amount, 0)
            )::numeric AS pending_amount
          FROM vendors v
          LEFT JOIN (
            SELECT vendor_id, SUM(total_cost) AS total_purchase
            FROM material_purchases
            WHERE user_id = $1
            GROUP BY vendor_id
          ) p ON p.vendor_id = v.id
          LEFT JOIN (
            SELECT vendor_id, SUM(paid_amount) AS paid_amount
            FROM vendor_payments
            WHERE user_id = $1
            GROUP BY vendor_id
          ) pay ON pay.vendor_id = v.id
          WHERE v.id = $2 AND v.user_id = $1
          `,
          [req.user.id, id]
        );

      const transactions =
        await pool.query(
          `
          SELECT
            p.id,
            p.purchase_date AS transaction_date,
            'Purchase' AS type,
            m.material_name AS description,
            p.total_cost AS debit,
            0::numeric AS credit
          FROM material_purchases p
          LEFT JOIN materials m ON m.id = p.material_id
          WHERE p.vendor_id = $2 AND p.user_id = $1

          UNION ALL

          SELECT
            vp.id,
            vp.payment_date AS transaction_date,
            'Payment' AS type,
            vp.payment_method AS description,
            0::numeric AS debit,
            vp.paid_amount AS credit
          FROM vendor_payments vp
          WHERE vp.vendor_id = $2 AND vp.user_id = $1

          ORDER BY transaction_date DESC NULLS LAST, id DESC
          `,
          [req.user.id, id]
        );

      res.status(200).json({
        success: true,
        vendor: vendor.rows[0],
        transactions: transactions.rows,
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
