import Home from "../models/home.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getHomeData = asyncHandler(async (req, res) => {
  let homeData = await Home.findOne();

  if (!homeData) {
    // Create default if it doesn't exist
    homeData = await Home.create({
      carousel: [],
      counts: {
        totalProjects: "0",
        totalClients: "0",
        totalCities: "0",
        totalArea: "0",
      },
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, homeData, "Home data fetched successfully"));
});

export const updateHomeData = asyncHandler(async (req, res) => {
  const { carousel, counts } = req.body;

  const updateData = {};
  if (carousel) updateData.carousel = carousel;
  if (counts) updateData.counts = counts;

  const homeData = await Home.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, homeData, "Home data updated successfully"));
});
