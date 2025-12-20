import moveFile from "../utils/moveFile.js";

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
