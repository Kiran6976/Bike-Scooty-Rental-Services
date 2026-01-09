const express = require('express');
const router = express.Router();

// ❌ DO NOT use adminAuthentication here
// Logout should always work even if token is expired

router.get('/adminsignout', (req, res) => {
  console.log('Admin logged out');

  res.clearCookie('jwtAdmin', { path: '/' });

  res.status(200).json({
    message: "Admin logged out successfully"
  });
});

module.exports = router;
