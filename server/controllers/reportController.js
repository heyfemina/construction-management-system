import pool from "../config/db.js";

export const getReports =
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
        SELECT * FROM reports
        WHERE user_id = $1
        ORDER BY id DESC
        `,
          [req.user.id]
        );

      res.status(200).json({
        success: true,
        reports: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const exportPDF =
  async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message:
          "PDF export working",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const exportExcel =
  async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message:
          "Excel export working",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
