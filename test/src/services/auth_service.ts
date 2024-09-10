import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";

const prisma = new PrismaClient();
const bcryptSalt = bcrypt.genSaltSync(10);

class AuthService {
  async Register({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
      const existingUser = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (existingUser) return "User already exists";

      const User = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      return User;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async Login({ username, password }: { username: string; password: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) return "User not found";

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return "Password is incorrect";
      }

      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
export default AuthService;
