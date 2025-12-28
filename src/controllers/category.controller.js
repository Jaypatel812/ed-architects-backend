import Category from "../models/category.model.js";
import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ statusCode: 400, success: false, message: "Name is required" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ statusCode: 201, success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Category with name already exists",
      });
    }
    res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ statusCode: 200, success: true, data: categories });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({ statusCode: 200, success: true, data: category });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Name is required",
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({ statusCode: 200, success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Category with name already exists",
      });
    }
    res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const existingProjects = await Project.findOne({
      categoryId: req.params.id,
    });

    if (existingProjects) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Category cannot be deleted as it is associated with projects",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
};
