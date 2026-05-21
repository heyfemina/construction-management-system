import pool from "../config/db.js";

export const getMaterials = async (
  req,
  res
) => {
  try {
    const result =
      await pool.query(
        `
        SELECT
          m.*,
          s.site_name,
          COALESCE(p.total_received, 0)::numeric AS total_received,
          COALESCE(u.total_used, 0)::numeric AS total_used,
          (
            COALESCE(p.total_received, 0) -
            COALESCE(u.total_used, 0)
          )::numeric AS remaining_stock,
          COALESCE(p.total_cost, 0)::numeric AS total_cost,
          COALESCE(p.transport_cost, 0)::numeric AS transport_cost
        FROM materials m
        LEFT JOIN sites s ON s.id = m.site_id
        LEFT JOIN (
          SELECT
            material_id,
            SUM(quantity) AS total_received,
            SUM(total_cost) AS total_cost,
            SUM(transport_cost) AS transport_cost
          FROM material_purchases
          WHERE user_id = $1
          GROUP BY material_id
        ) p ON p.material_id = m.id
        LEFT JOIN (
          SELECT
            material_id,
            SUM(used_quantity) AS total_used
          FROM material_usage
          WHERE user_id = $1
          GROUP BY material_id
        ) u ON u.material_id = m.id
        WHERE m.user_id = $1
        ORDER BY m.id DESC
        `,
        [req.user.id]
      );

    res.status(200).json({
      success: true,
      materials: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        m.*,
        s.site_name,
        COALESCE(p.total_received, 0)::numeric AS total_received,
        COALESCE(u.total_used, 0)::numeric AS total_used,
        (
          COALESCE(p.total_received, 0) -
          COALESCE(u.total_used, 0)
        )::numeric AS remaining_stock,
        COALESCE(p.total_cost, 0)::numeric AS total_cost,
        COALESCE(p.transport_cost, 0)::numeric AS transport_cost
      FROM materials m
      LEFT JOIN sites s ON s.id = m.site_id
      LEFT JOIN (
        SELECT
          material_id,
          SUM(quantity) AS total_received,
          SUM(total_cost) AS total_cost,
          SUM(transport_cost) AS transport_cost
        FROM material_purchases
        WHERE user_id = $1
        GROUP BY material_id
      ) p ON p.material_id = m.id
      LEFT JOIN (
        SELECT material_id, SUM(used_quantity) AS total_used
        FROM material_usage
        WHERE user_id = $1
        GROUP BY material_id
      ) u ON u.material_id = m.id
      WHERE m.id = $2 AND m.user_id = $1
      `,
      [req.user.id, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    res.status(200).json({
      success: true,
      material: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addMaterial = async (
  req,
  res
) => {
  try {
    const {
      site_id,
      material_name,
      unit,
    } = req.body;

    const result =
      await pool.query(
        `
        INSERT INTO materials
        (site_id, material_name, unit, user_id)

        VALUES ($1, $2, $3, $4)

        RETURNING *
        `,
        [
          site_id,
          material_name,
          unit,
          req.user.id,
        ]
      );

    res.status(201).json({
      success: true,
      material: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { site_id, material_name, unit } = req.body;

    const result = await pool.query(
      `
      UPDATE materials
      SET site_id = $1, material_name = $2, unit = $3
      WHERE id = $4 AND user_id = $5
      RETURNING *
      `,
      [
        site_id || null,
        material_name,
        unit,
        id,
        req.user.id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    res.status(200).json({
      success: true,
      material: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMaterial =
  async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        `
        DELETE FROM materials
        WHERE id = $1 AND user_id = $2
        `,
        [id, req.user.id]
      );

      res.status(200).json({
        success: true,
        message:
          "Material deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addMaterialPurchase = async (req, res) => {
  try {
    const {
      material_id,
      vendor_id,
      site_id,
      quantity,
      unit_cost,
      transport_cost,
      total_cost,
      purchase_date,
      notes,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO material_purchases
      (material_id, vendor_id, site_id, quantity, unit_cost, transport_cost, total_cost, purchase_date, notes, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        material_id || null,
        vendor_id || null,
        site_id || null,
        quantity,
        unit_cost,
        transport_cost || 0,
        total_cost,
        purchase_date,
        notes || "",
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      purchase: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMaterialActivity =
  async (req, res) => {
    try {
      const purchases =
        await pool.query(
          `
          SELECT
            p.*,
            m.material_name,
            v.vendor_name,
            s.site_name
          FROM material_purchases p
          LEFT JOIN materials m ON m.id = p.material_id
          LEFT JOIN vendors v ON v.id = p.vendor_id
          LEFT JOIN sites s ON s.id = p.site_id
          WHERE p.user_id = $1
          ORDER BY p.purchase_date DESC, p.id DESC
          `,
          [req.user.id]
        );

      const usage =
        await pool.query(
          `
          SELECT
            u.*,
            m.material_name,
            s.site_name
          FROM material_usage u
          LEFT JOIN materials m ON m.id = u.material_id
          LEFT JOIN sites s ON s.id = u.site_id
          WHERE u.user_id = $1
          ORDER BY u.usage_date DESC, u.id DESC
          `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        purchases: purchases.rows,
        usage: usage.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addMaterialUsage = async (req, res) => {
  try {
    const {
      material_id,
      site_id,
      used_quantity,
      usage_date,
      notes,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO material_usage
      (material_id, site_id, used_quantity, usage_date, notes, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        material_id || null,
        site_id || null,
        used_quantity,
        usage_date,
        notes || "",
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      usage: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
