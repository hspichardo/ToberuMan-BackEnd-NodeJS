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
var id;
var token;
describe('Testing toberumanAPI managing: CHAI + REST', function () {
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
    it('should return error authenticated', function (done) {
        chai.request(url)
            .post("/auth")
            .send({dni: '88fd88', password: 'testdduser'})
            .end(function (err,res) {
                expect(res).to.have.status((httpCodes.codes.NOTFOUND));
                expect(res.body).to.have.property('message',res.body.message);
                done();
            })
    });

    it('should return an ToberumanApi message', function(done){
        chai.request(url)
            .get("/")
            .end(function(err, res){
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.have.property('message','Bienvenido a Toberuman API Rest');
                done();
            });
    });

    it('should return an array of users', function (done) {
        chai.request(url)
            .get("/users")
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should create a new user', function (done) {
        chai.request(url)
            .post("/users")
            .set('Authorization', token)
            .send({name: "usuarioprueba",email: "prueba2@prueba.com",dni:"0315649866",password: "hola12345"})
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CREATED);
                expect(res.body).to.be.a('object');
                id = res.body._id;
                done();
            });
    });

    it('should return a conflict with the new user', function (done) {
        chai.request(url)
            .post("/users")
            .set('Authorization', token)
            .send({name: "usuarioprueba",email: "prueba2@prueba.com",dni:"0315649866",password: "hola12345"})
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CONFLICT);
                done();
            });
    });

    it('should get an specific user', function (done) {
        chai.request(url)
            .get("/users/"+id)
            .set('Authorization', token)
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.have.property('name','usuarioprueba');
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
    it('should update an user', function (done) {
        chai.request(url)
            .put("/users/"+id)
            .set('Authorization', token)
            .send({name: "usuariopruebaUPD",email: "prueba2@prueba.com",dni:"0315649466"})
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.NOCONTENT);
                expect(res.body).to.be.empty;
                done();
            });
    });



    it('should delete a user', function (done) {
        chai.request(url)
            .delete("/users/"+id)
            .set('Authorization', token)
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.OK);
                done();
            })
    });
});


