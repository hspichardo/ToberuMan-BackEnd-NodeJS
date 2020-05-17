function authorize(roles = []){
    if(typeof roles === 'string'){
        roles = [roles]
    }

    return[
        (req, res, next) =>{
        let count = 0;
        roles.forEach(role => {
            console.log(role);
            if(req.user.roles.includes(role)) count++;
        })

        console.log(req.user.roles);
        console.log(count);
        if (count === 0) return res.status(403).send('No tienes el Rol Permitido para acceder a este recurso');
            next()
        }
    ]
}

module.exports = authorize
