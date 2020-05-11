const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/toberumanapi',{userNewUrlParser:true})
.then(()=> console.log('Conectado a MongoDb'))
    .catch(erro => console.log(erro.message));

module.exports = mongoose
