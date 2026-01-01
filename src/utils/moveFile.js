import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moveFile = (file, folderName) => {
  const uploadDir = path.join(__dirname, "../../public/uploads", folderName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const newPath = path.join(uploadDir, file.filename);
  fs.renameSync(file.path, newPath);

  return `/uploads/${folderName}/${file.filename}`;
};

export default moveFile;
