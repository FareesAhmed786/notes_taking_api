let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.status(200).json({success: true, message: "Welcome to Notes Taking API+."})
});

module.exports = router;
