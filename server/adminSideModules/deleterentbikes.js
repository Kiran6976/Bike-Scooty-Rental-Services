const express = require("express");
const router = express.Router();
const adminAuthentication = require("../middelware/adminAuthentication");
const Rentbike = require("../models/rentbikeSchema");

router.post(
  "/deleteRentBikeFromDashboard",
  adminAuthentication,
  async (req, res) => {
    try {
      const { bikeIdFromDashBoard } = req.body;

      const deletedBike = await Rentbike.findByIdAndDelete(
        bikeIdFromDashBoard
      );

      if (!deletedBike) {
        return res.status(404).json({
          success: false,
          message: "Bike not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Bike deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
