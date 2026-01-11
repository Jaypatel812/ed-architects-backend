import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    carousel: { type: Array, required: true },
    counts: {
      totalProjects: { type: String, required: true },
      totalClients: { type: String, required: true },
      totalCities: { type: String, required: true },
      totalArea: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Home = mongoose.model("Home", homeSchema);

export default Home;
