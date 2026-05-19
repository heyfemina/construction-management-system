import pool from "../config/db.js";

export const getSites = async (
  req,
  res
) => {
  try {
    const result =
      await pool.query(
        `
      SELECT * FROM sites
      WHERE user_id = $1
      ORDER BY id DESC
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
        SELECT * FROM sites
        WHERE id = $1 AND user_id = $2
        `,
          [id, req.user.id]
        );

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
