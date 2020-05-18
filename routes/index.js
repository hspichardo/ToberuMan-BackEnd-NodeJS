var express = require('express');
var router = express.Router();
const initialMessage = 'Bienvenido a Toberuman API Rest';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({message: initialMessage});
});

module.exports = router;
