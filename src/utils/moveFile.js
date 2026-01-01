import fs from "fs";
import path from "path";

const moveFile = (file, folderName) => {
  const uploadDir = path.join("public/uploads", folderName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const newPath = path.join(uploadDir, file.filename);
  fs.renameSync(file.path, newPath);

  return `/uploads/${folderName}/${file.filename}`;
};

export default moveFile;
