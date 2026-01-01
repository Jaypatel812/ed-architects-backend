import Blog from "../models/blog.model.js";
import fs from "fs";
import path from "path";

export const createBlog = async (req, res) => {
  try {
    const { title, description, images, status } = req.body;

    if (!title || !description || !images || !status) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "All fields are required",
      });
    }

    if (!Array.isArray(description) || description.length < 1) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "At least one description is required",
      });
    }

    if (!Array.isArray(images) || images.length < 1) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "At least one image is required",
      });
    }

    const blog = new Blog({
      title,
      description,
      images,
      status,
    });

    await blog.save();
    res.status(201).json({ statusCode: 201, success: true, data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ statusCode: 200, success: true, data: blogs });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({ statusCode: 200, success: true, data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { description, images } = req.body;

    // Validate if any update fields are present that require checks
    if (
      description &&
      (!Array.isArray(description) || description.length < 1)
    ) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "At least one description is required",
      });
    }

    if (images && (!Array.isArray(images) || images.length < 1)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "At least one image is required",
      });
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!blog) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({ statusCode: 200, success: true, data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Blog not found",
      });
    }

    // Delete associated images
    if (blog.images && Array.isArray(blog.images)) {
      blog.images.forEach((imageUrl) => {
        try {
          const relativePath = imageUrl.startsWith("/")
            ? imageUrl.slice(1)
            : imageUrl;
          const fullPath = path.join(process.cwd(), "public", relativePath);

          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (err) {
          console.error(`Failed to delete image: ${imageUrl}`, err);
        }
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};
