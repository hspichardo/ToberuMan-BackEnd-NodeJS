const mongoose = require('mongoose');
const authorize = require('../middleware/role');
const auth = require('../middleware/auth');
const express = require('express');
const { check, validationResult } = require('express-validator');
const {Table}= require('../models/table');
const router = express.Router();
const httpCodes = require('../resources/httpCodes');

router.get('/', auth, async (req, res) => {
    const tables = await Table.find();
    res.status(httpCodes.codes.OK).json(tables);
});

router.get('/:id', auth, async (req, res) => {
    const table = await Table.findOne({_id: req.params.id});
    if(!table) return res.status(httpCodes.codes.NOTFOUND).send('Table not found in DB');
    res.status(httpCodes.codes.OK).json(table);
});

router.post('/', [auth, authorize(['Admin','Manager'])],[
    check('number').isNumeric(),
    check('capacity').isNumeric()
],async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.CONFLICT).json({ errors: errors.array() });
    }
    const table = new Table({
        number: req.body.number,
        capacity: req.body.capacity,
        isReserved: req.body.isReserved,
        isTaken: req.body.isTaken,
        reservationDate: req.body.reservationDate
    })

    const result = await table.save();
    res.status(httpCodes.codes.CREATED).send({
        _id: table._id,
        capacity: table.capacity,
        isReserved: table.isReserved,
        isTaken: table.isTaken,
        reservationDate: table.reservationDate
    });
});

router.put('/:id',[auth, authorize(['Admin','Manager','Waiter'])], [
    check('number').isNumeric(),
    check('capacity').isNumeric()
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.FORBIDDEN).json({ errors: errors.array() });
    }
    const table = await Table.findByIdAndUpdate(req.params.id,{
            number: req.body.number,
            capacity: req.body.capacity,
            isTaken: req.body.isTaken,
            isReserved: req.body.isReserved,
            reservationDate: req.body.reservationDate
        },
        {
            new: true
        });

    if(!table){
        return res.status(httpCodes.codes.NOTFOUND).json({message: 'Table not found in DB'});
    }

    res.status(httpCodes.codes.NOCONTENT).send();
});
router.delete('/:id',  [auth, authorize(['Admin','Manager'])],async(req, res)=>{

    const table = await Table.findByIdAndDelete(req.params.id);

    if(!table){
        return res.status(httpCodes.codes.NOTFOUND).json({message: 'Table not found'});
    }

    res.status(httpCodes.codes.OK).json({message: "Table Deleted"});

});
module.exports = router;
