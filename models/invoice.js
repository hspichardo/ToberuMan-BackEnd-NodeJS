const mongoose = require('mongoose')
const {orderSchema} = require('./order')

const invoiceSchema = new mongoose.Schema({
    number:{
        type: Number,
        required: true,
        unique: true
    },
    order: {
        type: orderSchema,
        required: true
    },
    subTotal: {
        type: Number
    },
    total: {
        type: Number
    },
    tax: {
        type: Number,
        default: 12
    },
    date: {type: Date, default: Date.now}
})

const Invoice = mongoose.model('invoice', invoiceSchema)

module.exports = Invoice
