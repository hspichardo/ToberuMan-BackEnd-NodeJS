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
var token;

describe('Testing toberumanAPI Table Model managing: CHAI + REST', function () {
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

    it('should create a new table and get errors', function (done) {
        chai.request(url)
            .post("/table")
            .set('Authorization', token)
            .send({
                "number": 'sdfsdfds',
                "capacity": 4
            })
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CONFLICT);
                done();
            });
    });
    it('should return an array of tables', function (done) {
        chai.request(url)
            .get("/table")
            .set('Authorization', token)
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.be.a('array');
                done();
            });
    });
    it('should get a specific table', function (done) {
        chai.request(url)
            .get("/table/"+idtable)
            .set('Authorization', token)
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.have.property('capacity',4);
                done();
            });
    });
    it('should get an specific table and dont found', function (done) {
        chai.request(url)
            .get("/table/5ebd84e9f6dab12345678dfd")
            .set('Authorization', token)
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.NOTFOUND);
                done();
            });
    });
    it('should update a table', function (done) {
        chai.request(url)
            .put("/table/"+idtable)
            .set('Authorization', token)
            .send({number: 4,capacity: 5,isTaken: false,isReserved: false, reservationDate: Date.now()})
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.NOCONTENT);
                expect(res.body).to.be.empty;
                done();
            });
    });
    it('should try to update a table but get error', function (done) {
        chai.request(url)
            .put("/table/5ebd84e9f6dab12345678dfd")
            .set('Authorization', token)
            .send({number: 4,capacity: 5,isTaken: false,isReserved: false, reservationDate: Date.now()})
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.NOTFOUND);
                done();
            });
    });
    it('should delete a table', function (done) {
        chai.request(url)
            .delete("/table/"+idtable)
            .set('Authorization', token)
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.OK);
                done();
            })
    });
    it('should try to delete a table but get error', function (done) {
        chai.request(url)
            .delete("/table/5ebd84e9f6dab12345678dfd")
            .set('Authorization', token)
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.NOTFOUND);
                done();
            })
    });

});
