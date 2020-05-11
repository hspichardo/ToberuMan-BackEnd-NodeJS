var express = require('express');
var router = express.Router();
const hola = 'Hola Mundo';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(hola);
});

module.exports = router;
