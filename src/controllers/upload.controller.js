import moveFile from "../utils/moveFile.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImages = async (req, res) => {
  try {
    const { folder } = req.body;

    if (!folder) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (req.files.length > 12) {
      return res.status(400).json({ message: "Maximum 12 images allowed" });
    }

    const imageUrls = req.files.map((file) => moveFile(file, folder));

    res.status(201).json({
      message: "Images uploaded successfully",
      images: imageUrls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteImages = async (req, res) => {
  try {
    const { imageUrls } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: "Image URLs are required" });
    }

    const deletedImages = [];
    const notFoundImages = [];

    imageUrls.forEach((imageUrl) => {
      // Construct the absolute path
      const relativePath = imageUrl.startsWith("/")
        ? imageUrl.slice(1)
        : imageUrl;
      const fullPath = path.join(__dirname, "../../public", relativePath);

      // Security check: ensure the path is within the public/uploads directory
      const uploadsDir = path.join(__dirname, "../../public", "uploads");

      const resolvedFullPath = path.resolve(fullPath);
      const resolvedUploadsDir = path.resolve(uploadsDir);

      if (!resolvedFullPath.startsWith(resolvedUploadsDir)) {
        console.warn(`Attempted illegal access: ${resolvedFullPath}`);
        return; // Skip illegal paths
      }

      if (fs.existsSync(resolvedFullPath)) {
        if (fs.lstatSync(resolvedFullPath).isDirectory()) {
          return; // Skip directories
        }
        fs.unlinkSync(resolvedFullPath);
        deletedImages.push(imageUrl);
      } else {
        notFoundImages.push(imageUrl);
      }
    });

    return res.status(200).json({
      message: "Images processed",
      deletedImages,
      notFoundImages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
