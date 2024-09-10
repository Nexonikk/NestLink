import multer from "multer";

const storage = multer.memoryStorage();

const multiUpload = multer({ storage }).fields([
  { name: "avatar", maxCount: 1 },
  { name: "bgImg", maxCount: 1 },
  { name: "icon", maxCount: 1 },
]);

export default multiUpload;
