const express = require("express");
const router = express.Router();

// Sign Out route (NO authenticate middleware)
router.get("/signout", (req, res) => {
  console.log("User logged out");

  res.clearCookie("jwtoken", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "User logged out successfully",
  });
});

module.exports = router;
