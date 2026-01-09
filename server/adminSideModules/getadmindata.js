const express = require("express");
const router = express.Router();
const adminAuthentication = require("../middelware/adminAuthentication");

router.get("/getadmindata", adminAuthentication, (req, res) => {
  res.status(200).json({
    admin: req.rootAdmin,
    success: true,
  });
});

module.exports = router;
