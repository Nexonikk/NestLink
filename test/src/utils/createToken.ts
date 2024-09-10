import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export default function createToken(username: string): string | null {
  try {
    if (jwtSecret) {
      const token = jwt.sign({ username }, jwtSecret, {
        expiresIn: "7d",
      });
      return token;
    } else {
      throw new Error("JWT Secret not defined");
    }
  } catch (error: any) {
    console.error("Token generation error:", error);
    return null;
  }
}
