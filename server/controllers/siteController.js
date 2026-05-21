import pool from "../config/db.js";

export const getSites = async (
  req,
  res
) => {
  try {
    const result =
      await pool.query(
        `
      SELECT
        s.*,
        COALESCE(e.total_expense, 0)::numeric AS total_expense,
        COALESCE(m.material_cost, 0)::numeric AS material_cost,
        COALESCE(l.labour_count, 0)::int AS labour_count
      FROM sites s
      LEFT JOIN (
        SELECT site_id, SUM(amount) AS total_expense
        FROM expenses
        WHERE user_id = $1
        GROUP BY site_id
      ) e ON e.site_id = s.id
      LEFT JOIN (
        SELECT site_id, SUM(total_cost) AS material_cost
        FROM material_purchases
        WHERE user_id = $1
        GROUP BY site_id
      ) m ON m.site_id = s.id
      LEFT JOIN (
        SELECT site_id, COUNT(*) AS labour_count
        FROM labours
        WHERE user_id = $1
        GROUP BY site_id
      ) l ON l.site_id = s.id
      WHERE s.user_id = $1
      ORDER BY s.id DESC
      `,
        [req.user.id]
      );

    res.status(200).json({
      success: true,
      sites: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleSite =
  async (req, res) => {
    try {
      const { id } = req.params;

      const result =
        await pool.query(
          `
        SELECT
          s.*,
          COALESCE(e.total_expense, 0)::numeric AS total_expense,
          COALESCE(m.material_cost, 0)::numeric AS material_cost,
          COALESCE(w.labour_cost, 0)::numeric AS labour_cost,
          COALESCE(l.labour_count, 0)::int AS labour_count
        FROM sites s
        LEFT JOIN (
          SELECT site_id, SUM(amount) AS total_expense
          FROM expenses
          WHERE user_id = $2
          GROUP BY site_id
        ) e ON e.site_id = s.id
        LEFT JOIN (
          SELECT site_id, SUM(total_cost) AS material_cost
          FROM material_purchases
          WHERE user_id = $2
          GROUP BY site_id
        ) m ON m.site_id = s.id
        LEFT JOIN (
          SELECT l.site_id, SUM(w.total_amount) AS labour_cost
          FROM wages w
          LEFT JOIN labours l ON l.id = w.labour_id
          WHERE w.user_id = $2
          GROUP BY l.site_id
        ) w ON w.site_id = s.id
        LEFT JOIN (
          SELECT site_id, COUNT(*) AS labour_count
          FROM labours
          WHERE user_id = $2
          GROUP BY site_id
        ) l ON l.site_id = s.id
        WHERE s.id = $1 AND s.user_id = $2
        `,
          [id, req.user.id]
        );

      if (!result.rows[0]) {
        return res.status(404).json({
          success: false,
          message: "Site not found",
        });
      }

      res.status(200).json({
        success: true,
        site: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addSite = async (
  req,
  res
) => {
  try {
    const {
      site_name,
      location,
      description,
    } = req.body;

    const result =
      await pool.query(
        `
      INSERT INTO sites
      (
        site_name,
        location,
        description,
        user_id
      )

      VALUES ($1, $2, $3, $4)

      RETURNING *
      `,
        [
          site_name,
          location,
          description,
          req.user.id,
        ]
      );

    res.status(201).json({
      success: true,
      site: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSite =
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        site_name,
        location,
        description,
      } = req.body;

      const result =
        await pool.query(
          `
        UPDATE sites

        SET
        site_name = $1,
        location = $2,
        description = $3

        WHERE id = $4 AND user_id = $5

        RETURNING *
        `,
          [
            site_name,
            location,
            description,
            id,
            req.user.id,
          ]
        );

      if (!result.rows[0]) {
        return res.status(404).json({
          success: false,
          message: "Site not found",
        });
      }

      res.status(200).json({
        success: true,
        site: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteSite =
  async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        `
      DELETE FROM sites
      WHERE id = $1 AND user_id = $2
      `,
        [id, req.user.id]
      );

      res.status(200).json({
        success: true,
        message:
          "Site deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getSiteReport =
  async (req, res) => {
    try {
      const { id } = req.params;

      const site = await pool.query(
        `
        SELECT
          s.*,
          COALESCE(e.total_expense, 0)::numeric AS total_expense,
          COALESCE(m.material_cost, 0)::numeric AS material_cost,
          COALESCE(w.labour_cost, 0)::numeric AS labour_cost,
          COALESCE(l.labour_count, 0)::int AS labour_count
        FROM sites s
        LEFT JOIN (
          SELECT site_id, SUM(amount) AS total_expense
          FROM expenses
          WHERE user_id = $2
          GROUP BY site_id
        ) e ON e.site_id = s.id
        LEFT JOIN (
          SELECT site_id, SUM(total_cost) AS material_cost
          FROM material_purchases
          WHERE user_id = $2
          GROUP BY site_id
        ) m ON m.site_id = s.id
        LEFT JOIN (
          SELECT l.site_id, SUM(w.total_amount) AS labour_cost
          FROM wages w
          LEFT JOIN labours l ON l.id = w.labour_id
          WHERE w.user_id = $2
          GROUP BY l.site_id
        ) w ON w.site_id = s.id
        LEFT JOIN (
          SELECT site_id, COUNT(*) AS labour_count
          FROM labours
          WHERE user_id = $2
          GROUP BY site_id
        ) l ON l.site_id = s.id
        WHERE s.id = $1 AND s.user_id = $2
        `,
        [id, req.user.id]
      );

      if (!site.rows[0]) {
        return res.status(404).json({
          success: false,
          message: "Site not found",
        });
      }

      const [materials, labours, vendors, expenses] = await Promise.all([
        pool.query(
          `
          SELECT
            m.id,
            m.material_name,
            m.unit,
            COALESCE(p.total_received, 0)::numeric AS total_received,
            COALESCE(u.total_used, 0)::numeric AS total_used,
            (
              COALESCE(p.total_received, 0) -
              COALESCE(u.total_used, 0)
            )::numeric AS remaining_stock,
            COALESCE(p.total_cost, 0)::numeric AS total_cost,
            COALESCE(p.transport_cost, 0)::numeric AS transport_cost
          FROM materials m
          LEFT JOIN (
            SELECT
              material_id,
              SUM(quantity) AS total_received,
              SUM(total_cost) AS total_cost,
              SUM(transport_cost) AS transport_cost
            FROM material_purchases
            WHERE site_id = $1 AND user_id = $2
            GROUP BY material_id
          ) p ON p.material_id = m.id
          LEFT JOIN (
            SELECT material_id, SUM(used_quantity) AS total_used
            FROM material_usage
            WHERE site_id = $1 AND user_id = $2
            GROUP BY material_id
          ) u ON u.material_id = m.id
          WHERE m.site_id = $1 AND m.user_id = $2
          ORDER BY m.material_name
          `,
          [id, req.user.id]
        ),
        pool.query(
          `
          SELECT
            l.*,
            COALESCE(w.total_wage, 0)::numeric AS total_wage,
            COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
            (
              COALESCE(w.total_wage, 0) -
              COALESCE(pay.paid_amount, 0)
            )::numeric AS pending_amount
          FROM labours l
          LEFT JOIN (
            SELECT labour_id, SUM(total_amount) AS total_wage
            FROM wages
            WHERE user_id = $2
            GROUP BY labour_id
          ) w ON w.labour_id = l.id
          LEFT JOIN (
            SELECT labour_id, SUM(paid_amount) AS paid_amount
            FROM labour_payments
            WHERE user_id = $2
            GROUP BY labour_id
          ) pay ON pay.labour_id = l.id
          WHERE l.site_id = $1 AND l.user_id = $2
          ORDER BY l.labour_name
          `,
          [id, req.user.id]
        ),
        pool.query(
          `
          SELECT
            v.id,
            v.vendor_name,
            v.contact_number,
            v.email,
            COALESCE(p.total_purchase, 0)::numeric AS total_purchase,
            COALESCE(pay.paid_amount, 0)::numeric AS paid_amount,
            (
              COALESCE(p.total_purchase, 0) -
              COALESCE(pay.paid_amount, 0)
            )::numeric AS pending_amount
          FROM vendors v
          INNER JOIN (
            SELECT vendor_id, SUM(total_cost) AS total_purchase
            FROM material_purchases
            WHERE site_id = $1 AND user_id = $2 AND vendor_id IS NOT NULL
            GROUP BY vendor_id
          ) p ON p.vendor_id = v.id
          LEFT JOIN (
            SELECT vendor_id, SUM(paid_amount) AS paid_amount
            FROM vendor_payments
            WHERE user_id = $2
            GROUP BY vendor_id
          ) pay ON pay.vendor_id = v.id
          WHERE v.user_id = $2
          ORDER BY v.vendor_name
          `,
          [id, req.user.id]
        ),
        pool.query(
          `
          SELECT *
          FROM expenses
          WHERE site_id = $1 AND user_id = $2
          ORDER BY expense_date DESC, id DESC
          `,
          [id, req.user.id]
        ),
      ]);

      res.status(200).json({
        success: true,
        site: site.rows[0],
        materials: materials.rows,
        labours: labours.rows,
        vendors: vendors.rows,
        expenses: expenses.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
