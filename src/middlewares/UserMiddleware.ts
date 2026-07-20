import User from "../entities/User";
import jwt from "jsonwebtoken";

export async function checkUser(token?: string) {
  if (!token) {
    return new Error("Token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      data: number;
    };

    const user = await User.findOne({ where: { id: decoded.data } });

    return user;
  } catch (error) {
    return error;
  }
}
