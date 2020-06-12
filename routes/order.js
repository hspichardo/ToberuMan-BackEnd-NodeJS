const mongoose = require('mongoose');
const authorize = require('../middleware/role');
const auth = require('../middleware/auth');
const express = require('express');
const { check, validationResult } = require('express-validator');
const {Table}= require('../models/table');
const {orderLineSchema} = require('../models/orderLine')
const {OrderLine} = require('../models/orderLine')
const {Menu} = require('../models/menu')
const {Order} = require('../models/order')
const router = express.Router();
const httpCodes = require('../resources/httpCodes');
const moment = require('moment')



router.post('/', [auth, authorize(['Admin','Manager','Waiter'])],async(req, res)=>{
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
router.get('/:id', auth, async (req, res) => {
    const order = await Order.findOne({_id: req.params.id});
    if(!order) return res.status(httpCodes.codes.NOTFOUND).send('Order not found in DB');
    res.status(httpCodes.codes.OK).json(order);
});

router.put('/:id',[auth, authorize(['Admin','Manager','Waiter'])], [
    check('tableid').isLength({min: 3})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.FORBIDDEN).json({ errors: errors.array() });
    }

    const orderLines = [];
    for (const line of req.body.orderLines) {
        let orderline = new OrderLine({
            menu: await Menu.findById(line.menuid),
            amount: line.amount
        });
        orderLines.push(orderline);
    }

    const table = await Table.findById(req.body.tableid);

    const order = await Order.findByIdAndUpdate(req.params.id,{
            table: table,
            orderLines: orderLines,
            isReady: req.body.isReady
        },
        {
            new: true
        })

    if(!order){
        return res.status(httpCodes.codes.NOTFOUND).json({message: 'la orden con ese ID no se encuentra en la base de datos'});
    }

    res.status(httpCodes.codes.NOCONTENT).send();
});

router.delete('/:id',  [auth, authorize(['Admin','Manager'])],async(req, res)=>{

    const order = await Order.findByIdAndDelete(req.params.id);

    if(!order){
        return res.status(httpCodes.codes.NOTFOUND).json({message: 'la orden con ese ID no esta, no se puede borrar'});
    }

    res.status(httpCodes.codes.OK).json({message: "Orden eliminada correctamente"});

});
router.get('/cousine/all', auth, async (req, res) => {
    const today = moment().startOf('day');

    const orders = await Order.find({
        date: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
        }
    }).sort({date: -1});
    res.status(httpCodes.codes.OK).json(orders);
});
module.exports = router;
