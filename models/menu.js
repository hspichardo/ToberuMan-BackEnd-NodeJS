const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const menuSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    menuType:{
        type: String,
        enum: ['DRINK', 'FOOD', 'COMBO'],
        default: 'FOOD'
    },
    price:{
        type: Number,
        required: true
    },
    isAviable: {
        type: Boolean,
        default: true
    }
});
const Menu = mongoose.model('menu',menuSchema);

module.exports = Menu;
