const express = require('express');
const router = express.Router();

/* /api/logout/* endpoint controllers */
router.get('/', function (req, res) {
  req.logout((err) => {
    if (err) {
      res.status(400);
      res.json({error: err.message});
      return;
    }
    req.session.destroy((err) => {
      if (err) {
        res.status(400);
        res.json({error: err.message});
        return;
      }
      res.clearCookie('connect.sid');
      res.json({success: 1});
    })
  });
});

module.exports = router;
