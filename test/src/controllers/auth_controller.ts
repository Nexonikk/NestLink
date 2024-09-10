import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth_service.js";
import createToken from "../utils/createToken.js";
import logger from "../config/logger.js";

const authService = new AuthService();

class AuthController {
  async Register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          message: "Username and password are required",
        });
        return;
      }

      const response = await authService.Register({
        username,
        password,
      });

      const token = createToken(username);

      if (!token) {
        res.status(500).json({
          message: "Token generation failed",
        });
        return;
      }

      res.cookie("token", token, {
        httpOnly: true,
      });

      res.status(200).json({
        message: "User successfully created",
        data: response,
        token, // Include the token in the response
      });
    } catch (error) {
      logger.error(error);
      console.error("Register error:", error);
    }
  }

  async Login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({
          message: "Username and password are required",
        });
        return;
      }
      const response = await authService.Login({
        username,
        password,
      });

      if (
        response === "Password is incorrect" ||
        response === "User not found"
      ) {
        res.status(401).json({
          data: response,
        });
      }

      const token = createToken(username);

      if (!token) {
        res.status(500).json({
          message: "Token generation failed",
        });
        return;
      }

      res.cookie("token", token, {
        httpOnly: true,
      });

      res.status(200).json({
        message: "User succesfully Logged in",
        data: response,
        token,
      });
    } catch (error) {
      logger.error(error);
      console.error("Login error:", error);
    }
  }
}

export default AuthController;
