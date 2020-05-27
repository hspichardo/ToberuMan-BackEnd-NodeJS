const mongoose = require('mongoose');
const authorize = require('../middleware/role');
const auth = require('../middleware/auth');
const express = require('express');
const { check, validationResult } = require('express-validator');
const {Menu} = require('../models/menu');
const router = express.Router();
const httpCodes = require('../resources/httpCodes');

router.post('/', [auth, authorize(['Admin','Manager'])],[
    check('name').isLength({min: 3}),
    check('description').isLength({min: 3}),
    check('price').isDecimal(),
],async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.CONFLICT).json({ errors: errors.array() });
    }
    const menu = new Menu({
        name: req.body.name,
        description: req.body.description,
        menuType: req.body.menuType,
        price: req.body.price,
        isAviable: req.body.isAbiable
    })

    const result = await menu.save();
    res.status(httpCodes.codes.CREATED).send({
        _id: menu._id,
        description: menu.description,
        menuType: menu.menuType,
        price: menu.price,
        isAviable: menu.isAviable
    });
});
router.get('/', auth, async (req, res) => {
    const menus = await Menu.find();
    res.status(httpCodes.codes.OK).json(menus);
});

router.get('/:id', auth, async (req, res) => {
    const menu = await Menu.findOne({_id: req.params.id});
    if(!menu) return res.status(httpCodes.codes.NOTFOUND).send('Menu not found in DB');
    res.status(httpCodes.codes.OK).json(menu);
});

router.put('/:id',[auth, authorize(['Admin','Manager'])], [
    check('name').isLength({min: 3}),
    check('description').isLength({min: 3})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.FORBIDDEN).json({ errors: errors.array() });
    }

    const menu = await Menu.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            menuType: req.body.menuType,
            isAviable: req.body.isAviable
        },
        {
            new: true
        })

    if(!menu){
        return res.status(httpCodes.codes.NOTFOUND).json({message: 'El menu con ese ID no se encuentra en la base de datos'});
    }

    res.status(httpCodes.codes.NOCONTENT).send();
});

router.delete('/:id',  [auth, authorize(['Admin','Manager'])],async(req, res)=>{

    const menu = await Menu.findByIdAndDelete(req.params.id);

    if(!menu){
        return res.status(httpCodes.codes.NOTFOUND).json({message: 'El menu con ese ID no esta, no se puede borrar'});
    }

    res.status(httpCodes.codes.OK).json({message: "Menu eliminado correctamente"});

});

module.exports = router;
