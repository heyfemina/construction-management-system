import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const toPublicUser = (user) => {
  const { password, ...publicUser } = user;
  return publicUser;
};

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

      const userExists =
        await pool.query(
          `
        SELECT * FROM users
        WHERE email = $1
        `,
          [email]
        );

      if (
        userExists.rows.length > 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "User already exists",
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
            name,
            email,
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

    const result =
      await pool.query(
        `
      SELECT * FROM users
      WHERE email = $1
      `,
        [email]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
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
          "Invalid password",
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
