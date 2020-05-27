const mongoose = require('mongoose');
const authorize = require('../middleware/role');
const auth = require('../middleware/auth');
const express = require('express');
const { check, validationResult } = require('express-validator');
const {Table}= require('../models/table');
const {orderLineSchema} = require('../models/orderLine')
const Order = require('../models/order')
const router = express.Router();
const httpCodes = require('../resources/httpCodes');

router.post('/', [auth, authorize(['Admin','Manager'])],async(req, res)=>{
    var orderLines = req.body.orderLines;
    const table = await Table.findById(req.body.tableid);
    const order = new Order({
        table: table,
        orderLines: orderLines
    })
    const result = await order.save();
    res.status(httpCodes.codes.CREATED).send(order);
});

module.exports = router;
