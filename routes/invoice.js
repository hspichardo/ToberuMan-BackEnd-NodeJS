const mongoose = require('mongoose');
const authorize = require('../middleware/role');
const auth = require('../middleware/auth');
const express = require('express');
const { check, validationResult } = require('express-validator');
const Invoice = require('../models/invoice');
const {Order} = require('../models/order')
const router = express.Router();
const httpCodes = require('../resources/httpCodes');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const moment = require('moment');
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport')
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: { rejectUnauthorized: false }
}))

async function generatePdf(invoice) {
    const invoicedata = JSON.parse(JSON.stringify(invoice));
    invoicedata.order.orderLines.forEach(line => {
        line.subtotal = Number((line.menu.price * line.amount).toFixed(2));
    });
    invoicedata.taxtotal = invoicedata.subTotal * 0.12;
    const compile = async function (templateName, data) {
        const filePath = path.join(process.cwd(), 'invoicetemplate', `${templateName}.hbs`);
        const html = await fs.readFile(filePath, 'utf-8');
        return hbs.compile(html)(data);
    }
    hbs.registerHelper('dateFormat', function (value, format) {
        return moment(value).format(format);
    });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile('invoice', invoicedata);
    fs.writeFile('./invoices/invoice.html', content, function (err) {
        if (err) return console.log(err);
    });
    let filePath = path.join(process.cwd(), 'invoices', 'invoice.html');
    await page.goto(`file://${filePath}`, {waitUntil: 'networkidle0'});
    await page.emulateMedia('screen');
    await page.pdf({
        path: './invoices/invoice.pdf',
        format: 'A5',
        printBackground: true
    });
    console.log('done');
    await browser.close();
}

function sendMail(req, invoice) {
    var mailOptions = {
        from: 'toberumanapi@gmail.com',
        to: req.body.emailrecipient,
        subject: 'ToberuMan factura No. ' + invoice.number,
        text: 'Estimado, se adjunta la factura correspondiente a su pedido el dia de hoy!',
        attachments: [
            {
                filename: 'invoice.pdf',
                path: './invoices/invoice.pdf',
                cid: 'invoice@toberumanapi.herokuapp.com' // should be as unique as possible
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.post('/', [auth, authorize(['Admin','Manager','Waiter'])],async(req, res)=>{
    const orderIn = await Order.findOne({_id: req.body.idorder});
    if(!orderIn) return res.status(httpCodes.codes.NOTFOUND).send('Order not found in DB');
    const hasInvoice = await Invoice.findOne({order: orderIn});
    if(hasInvoice) return res.status(httpCodes.codes.CONFLICT).send('Invoice already exists');
    let invoiceCount = await Invoice.find();
    if(invoiceCount.length === 0) invoiceCount = 1;
    else invoiceCount = invoiceCount.length + 1;
    let subtotal = 0;
    for(let orderline of orderIn.orderLines){
        subtotal = subtotal + (orderline.menu.price * orderline.amount);
    }
    let total = subtotal + subtotal*0.12;
    const invoice = new Invoice({
        number: invoiceCount,
        order: orderIn,
        subTotal: Number((subtotal).toFixed(2)),
        total: Number((total).toFixed(2))
    });
   const result = await invoice.save();
    await generatePdf(invoice);
    var factura =  fs.readFileSync('./invoices/invoice.pdf');
    sendMail(req, invoice);
    res.setHeader('Content-Type', 'application/pdf');
    res.status(httpCodes.codes.CREATED).send(factura);
});

router.get('/', [auth, authorize(['Admin','Manager'])], async (req, res) => {
    const invoices = await Invoice.find();
    res.status(httpCodes.codes.OK).json(invoices);
});

router.get('/:id', [auth, authorize(['Admin','Manager'])], async (req, res) => {
    const invoice = await Invoice.findOne({_id: req.params.id});
    await generatePdf(invoice);
    var factura =  fs.readFileSync('./invoices/invoice.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.status(httpCodes.codes.OK).send(factura);
});

module.exports = router;
