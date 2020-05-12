const mongoose = require('mongoose');
const mongodbURL = (process.env.MONGODB_URI || 'mongodb://localhost/toberumanapi')
mongoose.connect(mongodbURL,{userNewUrlParser:true})
.then(()=> console.log('Conectado a MongoDb'))
    .catch(erro => console.log(erro.message));

module.exports = mongoose
