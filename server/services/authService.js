import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const createUserService = async (
  userData
) => {
  const { name, email, password } =
    userData;

  const hashedPassword =
    await bcrypt.hash(password, 10);

  return {
    name,
    email,
    password: hashedPassword,
  };
};

export const loginService = async (
  user
) => {
  return {
    token: generateToken(user.id),
    user,
  };
};