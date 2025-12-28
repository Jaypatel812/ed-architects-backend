import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      categoryId,
      location,
      client,
      siteArea,
      builtUpArea,
      carpetArea,
      description,
      images,
      status,
    } = req.body;

    if (!title || !categoryId || !location || !images || !status) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "All fields are required",
      });
    }

    if (!Array.isArray(images) || images.length < 1) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "At least one image is required",
      });
    }

    const project = new Project({
      title,
      categoryId,
      location,
      client,
      siteArea,
      builtUpArea,
      carpetArea,
      description,
      images,
      status,
    });

    await project.save();
    res.status(201).json({ statusCode: 201, success: true, data: project });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { categoryId } : {};
    const projects = await Project.find(filter).populate("categoryId");

    const data = projects.map((project) => {
      const { categoryId, ...rest } = project._doc;
      return {
        ...rest,
        category: {
          _id: project.categoryId?._id,
          name: project.categoryId?.name,
        },
      };
    });
    res.status(200).json({ statusCode: 200, success: true, data });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "categoryId"
    );
    if (!project) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Project not found",
      });
    }

    const { categoryId, ...projectData } = project._doc;
    const data = {
      ...projectData,
      category: { _id: project.categoryId._id, name: project.categoryId.name },
    };
    res.status(200).json({ statusCode: 200, success: true, data });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { images } = req.body;

    if (images && (!Array.isArray(images) || images.length < 1)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "At least one image is required",
      });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Project not found",
      });
    }
    res.status(200).json({ statusCode: 200, success: true, data: project });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Project not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, success: false, message: error.message });
  }
};
