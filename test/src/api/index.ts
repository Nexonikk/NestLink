import express from "express";
import authRouter from "./auth_router.js";
import profileRouter from "./profile_router.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/profile", profileRouter);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export default router;
