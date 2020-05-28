const mongoose = require('mongoose')
const {tableSchema} = require('./table')
const {orderLineSchema} = require('./orderLine')

const orderSchema = new mongoose.Schema({
    table:{
        type: tableSchema,
        required: true
    },
    orderLines: {
        type: [orderLineSchema]
    },
    isReady: {
        type: Boolean,
        default: false
    },
    date: {type: Date, default: Date.now}
})

const Order = mongoose.model('order', orderSchema)

module.exports = Order
