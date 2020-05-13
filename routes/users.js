const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/user')
const router = express.Router();
const httpCodes = require('../resources/httpCodes')
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(httpCodes.codes.OK).json(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(httpCodes.codes.NOTFOUND).send('User not found in DB')
    res.send(user);
});

router.post('/', [
    check('dni').isLength({min: 3}),
    check('email').isLength({min: 3},
        check('password').isLength({min: 8}))
],async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.FORBIDDEN).json({ errors: errors.array() });
    }
    let user = (await User.findOne({email: req.body.email}) || await User.findOne({dni: req.body.dni}) )
    if(user) return res.status(httpCodes.codes.CONFLICT).json({message: "Usuario ya existe"})

    user = new User({
        name: req.body.name,
        email: req.body.email,
        dni: req.body.dni,
        password: req.body.password,
        roles: req.body.roles
    })

    const result = await user.save()
    res.status(httpCodes.codes.CREATED).send(result)
});

router.put('/:id', [
    check('name').isLength({min: 3}),
    check('email').isLength({min: 3})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.codes.FORBIDDEN).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            dni: req.body.dni,
            email: req.body.email,
            roles: req.body.roles
        },
        {
            new: true
        })

    if(!user){
        return res.status(httpCodes.codes.NOTFOUND).send('El usuario con ese ID no esta')
    }

    res.status(httpCodes.codes.NOCONTENT).send()
})

router.delete('/:id', async(req, res)=>{

    const user = await User.findByIdAndDelete(req.params.id)

    if(!user){
        return res.status(httpCodes.codes.NOTFOUND).send('El user con ese ID no esta, no se puede borrar')
    }

    res.status(httpCodes.codes.OK).send({message: "Usuario eliminado correctamente"})

});
module.exports = router;
