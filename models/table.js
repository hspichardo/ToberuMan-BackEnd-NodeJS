const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const tableSchema = new mongoose.Schema({
    number:{
        type: Number,
        required: true
    },
    capacity:{
        type: Number,
        required: true
    },
    isReserved:{
        type: Boolean,
        default: false
    },
    isTaken:{
        type: Boolean,
        default: false
    },
    reservationDate:{
        type: Date,
        default: Date.now
    }
});
const Table = mongoose.model('table',tableSchema);

module.exports = Table;
