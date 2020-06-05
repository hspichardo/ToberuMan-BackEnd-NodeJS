const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const menuRouter = require('./routes/menu');
const authRouter = require('./routes/auth');
const tableRouter = require('./routes/table');
const orderRouter = require('./routes/order');
const invoiceRouter = require('./routes/invoice');
const mongodb = require('./db/mongocon')
const bodyParser = require('body-parser');
const app = express();
app.use(logger('dev'));
app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/menu', menuRouter);
app.use('/table',tableRouter);
app.use('/order', orderRouter);
app.use('/invoice', invoiceRouter);
module.exports = app;
