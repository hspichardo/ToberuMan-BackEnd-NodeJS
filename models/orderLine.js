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
const OrderLine = mongoose.model('orderLine', orderLineSchema)
module.exports.OrderLine = OrderLine;
module.exports.orderLineSchema = orderLineSchema
