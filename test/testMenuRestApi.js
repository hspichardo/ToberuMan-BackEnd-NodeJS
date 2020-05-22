'use strict';

var chai = require('chai'),
    chaiHttp = require('chai-http');
const expect = require('chai').expect;

var httpCodes = require('../resources/httpCodes');
let mocha = require('mocha');
let describe = mocha.describe;
const assert = chai.assert;
const menu = require('../models/menu')
chai.use(chaiHttp);
const url ='http://localhost:' + (process.env.PORT || '3000');
var id;
var token;
describe('Testing toberumanAPI Menu Model managing: CHAI + REST', function () {
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

    it('should create a new menu', function (done) {
        chai.request(url)
            .post("/menu")
            .set('Authorization', token)
            .send({name: "menuprueba",description: "pruabdesciptmenu",price:45.2})
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CREATED);
                expect(res.body).to.be.a('object');
                id = res.body._id;
                done();
            });
    });

    it('should return an error with the new menu', function (done) {
        chai.request(url)
            .post("/menu")
            .set('Authorization', token)
            .send({name: "ds",description: 1,price:45.2})
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CONFLICT);
                done();
            });

    });
    it('should return an array of menu', function (done) {
        chai.request(url)
            .get("/menu")
            .set('Authorization', token)
            .end(function(err,res) {
                    expect(res).to.have.status(httpCodes.codes.OK);
                    expect(res.body).to.be.a('array');
                    done();
                });
    });
    it('should get an specific menu', function (done) {
        chai.request(url)
            .get("/menu/"+id)
            .set('Authorization', token)
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.have.property('name','menuprueba');
                done();
            });
    });
    it('should get an specific user and dont found', function (done) {
        chai.request(url)
            .get("/users/5ebd84e9f6dab12345678dfd")
            .set('Authorization', token)
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.NOTFOUND);
                done();
            });
    });

    it('should update a menu', function (done) {
        chai.request(url)
            .put("/menu/"+id)
            .set('Authorization', token)
            .send({name: "usuariopruebaUPD",description: "testedited",price:45.2,isAviable: false, menuType: 'DRINK'})
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.NOCONTENT);
                expect(res.body).to.be.empty;
                done();
            });
    });
    it('should try to update a menu but get error', function (done) {
        chai.request(url)
            .put("/menu/5ebd84e9f6dab12345678dfd")
            .set('Authorization', token)
            .send({name: "usuariopruebaUPD",description: "testedited",price:45.2,isAviable: false, menuType: 'DRINK'})
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.NOTFOUND);
                done();
            });
    });
});


