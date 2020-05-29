const mongoose = require('mongoose');
const authorize = require('../middleware/role');
const auth = require('../middleware/auth');
const express = require('express');
const { check, validationResult } = require('express-validator');
const {Table}= require('../models/table');
const {orderLineSchema} = require('../models/orderLine')
const {OrderLine} = require('../models/orderLine')
const {Menu} = require('../models/menu')
const Order = require('../models/order')
const router = express.Router();
const httpCodes = require('../resources/httpCodes');

router.post('/', [auth, authorize(['Admin','Manager'])],async(req, res)=>{
    const orderLines = [];
    for (const line of req.body.orderLines) {
        let orderline = new OrderLine({
            menu: await Menu.findById(line.menuid),
            amount: line.amount
        });
        orderLines.push(orderline);
    }
    const table = await Table.findById(req.body.tableid);
    const order = new Order({
        table: table,
        orderLines: orderLines
    })
    const result = await order.save();
    res.status(httpCodes.codes.CREATED).send(order);
});

router.get('/', auth, async (req, res) => {
    const orders = await Order.find();
    res.status(httpCodes.codes.OK).json(orders);
});

module.exports = router;
