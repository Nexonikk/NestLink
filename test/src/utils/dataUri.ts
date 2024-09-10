import DataUriParser from "datauri/parser.js";
import path from "path";

const GetDataUri = (file) => {
  console.log("datauri loaded");
  const parser = new DataUriParser();

  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, file.buffer);
};

export default GetDataUri;
