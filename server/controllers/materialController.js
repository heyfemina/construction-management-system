import pool from "../config/db.js";

export const getMaterials = async (
  req,
  res
) => {
  try {
    const result =
      await pool.query(
        `
        SELECT * FROM materials
        WHERE user_id = $1
        ORDER BY id DESC
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
