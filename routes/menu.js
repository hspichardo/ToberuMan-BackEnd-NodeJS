const mongoose = require('mongoose');
const authorize = require('../middleware/role');
const auth = require('../middleware/auth');
const express = require('express');
const { check, validationResult } = require('express-validator');
const Menu = require('../models/menu');
const router = express.Router();
const httpCodes = require('../resources/httpCodes');

router.post('/', [auth, authorize(['Admin'])],[
    check('name').isLength({min: 3}),
    check('description').isLength({min: 3}),
    check('price').isDecimal(),
],async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.FORBIDDEN).json({ errors: errors.array() });
    }
    const menu = new Menu({
        name: req.body.name,
        description: req.body.description,
        menuType: req.body.menuType,
        price: req.body.price,
        isAviable: req.body.isAbiable
    })

    const result = await menu.save();
    res.status(httpCodes.codes.CREATED).send({
        _id: menu._id,
        description: menu.description,
        menuType: menu.menuType,
        price: menu.price,
        isAviable: menu.isAviable
    });
});
module.exports = router;
