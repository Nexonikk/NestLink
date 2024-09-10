import express from "express";
import cors from "cors";
import router from "./api/index.js";
import cookieparser from "cookie-parser";
import logger from "./config/logger.js";
import os from "os";
import cluster from "cluster";
import cloudinary from "cloudinary";

const CPU = os.cpus().length;
console.log("CPU", CPU);

if (cluster.isPrimary) {
  for (let i = 0; i < CPU; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  const port = process.env.PORT || 8000;

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieparser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  app.use("/api", router);

  logger.info("Server is running on http://localhost:8000");

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
