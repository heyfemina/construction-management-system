import pool from "../config/db.js";

const vendorSummarySelect = `
  SELECT
    v.*,
    s.site_name,
    COALESCE(p.total_purchase, 0)::numeric AS total_purchase,
    COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
    (
      COALESCE(p.total_purchase, 0) -
      COALESCE(pay.paid_amount, 0)
    )::numeric AS pending_amount
  FROM vendors v
  LEFT JOIN sites s ON s.id = v.site_id
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
`;

export const getVendors = async (req, res) => {
  try {
    const result = await pool.query(
      `
      ${vendorSummarySelect}
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

export const addVendor = async (req, res) => {
  try {
    const {
      vendor_name,
      site_id,
      contact_number,
      email,
      address,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO vendors
        (vendor_name, site_id, contact_number, email, address, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        vendor_name,
        site_id || null,
        contact_number || "",
        email || "",
        address || "",
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

export const getSingleVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      ${vendorSummarySelect}
      WHERE v.id = $2 AND v.user_id = $1
      `,
      [req.user.id, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
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

export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vendor_name,
      site_id,
      contact_number,
      email,
      address,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE vendors
      SET vendor_name = $1,
          site_id = $2,
          contact_number = $3,
          email = $4,
          address = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
      `,
      [
        vendor_name,
        site_id || null,
        contact_number || "",
        email || "",
        address || "",
        id,
        req.user.id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
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

export const deleteVendor = async (req, res) => {
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

export const getVendorLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await pool.query(
      `
      ${vendorSummarySelect}
      WHERE v.id = $2 AND v.user_id = $1
      `,
      [req.user.id, id]
    );

    if (!vendor.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const transactions = await pool.query(
      `
      SELECT
        p.id,
        p.purchase_date AS transaction_date,
        'Purchase' AS type,
        CONCAT_WS(
          ' - ',
          m.material_name,
          s.site_name,
          CONCAT(p.quantity, ' ', COALESCE(m.unit, 'unit'), ' @ ', p.unit_cost),
          NULLIF(p.notes, '')
        ) AS description,
        m.material_name,
        s.site_name,
        p.quantity,
        p.unit_cost,
        p.transport_cost,
        p.total_cost,
        p.total_cost AS debit,
        0::numeric AS credit
      FROM material_purchases p
      LEFT JOIN materials m ON m.id = p.material_id
      LEFT JOIN sites s ON s.id = p.site_id
      WHERE p.vendor_id = $2 AND p.user_id = $1

      UNION ALL

      SELECT
        vp.id,
        vp.payment_date AS transaction_date,
        'Payment' AS type,
        vp.payment_method AS description,
        NULL AS material_name,
        NULL AS site_name,
        NULL::numeric AS quantity,
        NULL::numeric AS unit_cost,
        NULL::numeric AS transport_cost,
        vp.total_amount AS total_cost,
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
