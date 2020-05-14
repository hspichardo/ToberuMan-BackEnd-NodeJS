const bcrypt = require('bcrypt');
const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/user')
const router = express.Router();
const httpCodes = require('../resources/httpCodes');

router.post('/', [
    check('dni').isLength({min: 3}),
    check('password').isLength({min: 8})
],async(req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.FORBIDDEN).json({errors: errors.array()});
    }
    let user = await User.findOne({dni: req.body.dni});
    if (!user) return res.status(httpCodes.codes.NOTFOUND).json({message: "Usuario y contraseña incorrectos"});
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(httpCodes.codes.NOTFOUND).json({message: "Usuario y contraseña incorrectos"});
    res.send('Usuario y contraseña correcta');
});

module.exports = router;
