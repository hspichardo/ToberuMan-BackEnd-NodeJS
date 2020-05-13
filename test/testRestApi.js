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
console.log(url);
describe('Testing toberumanAPI managing: CHAI + REST', function () {
    it('should return an Hola Mundo message', function(done){
        chai.request(url)
            .get("/")
            .end(function(err, res){
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.have.property('message','Hola Mundo');
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
            .send({name: "usuarioprueba",email: "prueba@prueba.com",dni:"0315649866",password: "hola12345"})
            .end(function (err,res) {
                expect(res).to.have.status(httpCodes.codes.CREATED);
                expect(res.body).to.be.a('object');
                id = res.body._id;
                done();
            });
    });

    it('should get an specific user', function (done) {
        chai.request(url)
            .get("/users/"+id)
            .end(function (err,res){
                expect(res).to.have.status(httpCodes.codes.OK);
                expect(res.body).to.have.property('name','usuarioprueba');
                done();
            });
    });
    it('should update an user', function (done) {
        chai.request(url)
            .put("/users/"+id)
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
            .end(function(err,res) {
                expect(res).to.have.status(httpCodes.codes.OK);
                done();
            })
    });
});


