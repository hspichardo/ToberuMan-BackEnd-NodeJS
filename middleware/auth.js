const jwt = require('jsonwebtoken');
const httpCodes = require('../resources/httpCodes');

function auth(req,res,next) {
    const jwtToken = req.header('Authorization');
    if(!jwtToken) return res.status(httpCodes.codes.UNAUTHORIZED).json({message: "Acceso denegado, necesitamos un token"});
    try{
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_TOBERUMAN_API);
        req.user = payload;
        next();
    }catch (e) {
        res.status(httpCodes.codes.UNAUTHORIZED).json({message: "Token no valido"});
    }
}

module.exports = auth
