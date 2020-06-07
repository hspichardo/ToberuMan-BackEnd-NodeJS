'use strict';

var chai = require('chai'),
    chaiHttp = require('chai-http');
const expect = require('chai').expect;

var httpCodes = require('../resources/httpCodes');
let mocha = require('mocha');
let describe = mocha.describe;
const assert = chai.assert;
chai.use(chaiHttp);
const url ='http://localhost:' + (process.env.PORT || '3000');
const emailto = 'toberumanapi@gmail.com';
var idorder;
var token;
var idtable;
var idmenu;

describe('Testing toberumanAPI Order Model managing: CHAI + REST', function () {
    it('should return token', function (done) {
        chai.request(url)
            .post("/auth")
            .send({dni: '8888', password: 'testuser'})
            .end(function (err,res) {
                expect(res).to.have.status((httpCodes.codes.OK));
                expect(res.body).to.have.property('token',res.body.token);
                token = res.body.token;
                done();
            })
    });
    it('should create a new table', function (done) {
        chai.request(url)
            .post("/table")
            .set('Authorization', token)
            .send({
                "number": 1,
                "capacity": 4
            })
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CREATED);
                expect(res.body).to.be.a('object');
                idtable = res.body._id;
                done();
            });
    });
    it('should create a menu', function (done) {
        chai.request(url)
            .post("/menu")
            .set('Authorization', token)
            .send({name: "menuprueba2",description: "pruabdesciptmenu2",price:45.2})
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CREATED);
                expect(res.body).to.be.a('object');
                idmenu = res.body._id;
                done();
            });
    });
    it('should create a new order', function (done) {
        chai.request(url)
            .post("/order")
            .set('Authorization', token)
            .send({
                "tableid": idtable,
                "orderLines": [{"menuid":idmenu, "amount": 2}]
            })
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CREATED);
                expect(res.body).to.be.a('object');
                idorder = res.body._id;
                console.log(res.body)
                done();
            });
    });

    it('should create and invoice for the order created previously', function (done) {
        chai.request(url)
            .post('/invoice')
            .set('Authorization', token)
            .send({"idorder":idorder,"emailrecipient":emailto})
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.CREATED);
                done();
            })
    });
    it('should try to create an invoice and get error beacause order dont exist', function (done) {
        chai.request(url)
            .post('/invoice')
            .send({"idorder":idorder,"emailrecipient":emailto})
            .set('Authorization', token)
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.CONFLICT);
                done();
            });
    });

    it('should delete an order', function (done) {
        chai.request(url)
            .delete("/order/"+idorder)
            .set('Authorization', token)
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.OK);
                done();
            })
    });


});
