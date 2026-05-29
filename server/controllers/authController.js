import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const toPublicUser = (user) => {
  const { password, ...publicUser } = user;
  return publicUser;
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const registerUser =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email and password are required",
        });
      }

      const cleanName = name.trim();
      const cleanEmail = normalizeEmail(email);

      if (!cleanName || !cleanEmail || !password.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name, email and password are required",
        });
      }

      const userExists =
        await pool.query(
          `
        SELECT * FROM users
        WHERE email = $1
        `,
          [cleanEmail]
        );

      if (
        userExists.rows.length > 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Admin account already exists. Please login with the saved password.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const result =
        await pool.query(
          `
        INSERT INTO users
        (name, email, password, role)

        VALUES ($1, $2, $3, $4)

        RETURNING *
        `,
          [
            cleanName,
            cleanEmail,
            hashedPassword,
            "admin",
          ]
        );

      res.status(201).json({
        success: true,
        token: generateToken(
          result.rows[0].id
        ),
        user: toPublicUser(result.rows[0]),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = normalizeEmail(email);

    const result =
      await pool.query(
        `
      SELECT * FROM users
      WHERE email = $1
      `,
        [cleanEmail]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(
        user.id
      ),
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, role, created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanName = (name || "").trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = (password || "").trim();

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1 AND id <> $2
      `,
      [cleanEmail, req.user.id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    if (cleanPassword && cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = cleanPassword
      ? await bcrypt.hash(cleanPassword, 10)
      : null;

    const result = await pool.query(
      `
      UPDATE users
      SET
        name = $1,
        email = $2,
        password = COALESCE($3, password)
      WHERE id = $4
      RETURNING id, name, email, role, created_at
      `,
      [cleanName, cleanEmail, hashedPassword, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
