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
var idtable;
var idmenu;
var token;
var idorder;

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

    it('should return all orders of db', function (done) {
        chai.request(url)
            .get('/order')
            .set('Authorization', token)
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.be.a('array');
                done();
            })
    });

    it('should update an order', function (done) {
        chai.request(url)
            .put('/order/'+idorder)
            .send({
                "tableid": idtable,
                "orderLines": [{"menuid":idmenu, "amount": 8}],
                "isReady": true
            })
            .set('Authorization', token)
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.NOCONTENT);
                expect(res.body).to.be.empty;
                done();
            })
    });

    it('should try to update a menu but get error', function (done) {
        chai.request(url)
            .put('/order/5ebd84e9f6dab12345678dfd')
            .send({
                "tableid": idtable,
                "orderLines": [{"menuid":idmenu, "amount": 8}],
                "isReady": true
            })
            .set('Authorization', token)
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.NOTFOUND);
                done();
            });
    });

});
