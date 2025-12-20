import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    location: { type: String, required: true },
    client: { type: String, required: false, default: "" },
    siteArea: { type: String, required: false, default: "" },
    builtUpArea: { type: String, required: false, default: "" },
    carpetArea: { type: String, required: false, default: "" },
    description: { type: [String], required: false, default: "" },
    images: { type: [String], required: true },
    status: { type: String, required: true, enum: ["ACTIVE", "INACTIVE"] },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
