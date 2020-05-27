const mongoose = require('mongoose');
const {menuSchema} = require('./menu')

const orderLineSchema = new mongoose.Schema({
    menu:{
        type: menuSchema,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

module.exports.orderLineSchema = orderLineSchema
