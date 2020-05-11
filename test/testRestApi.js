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

describe('Testing toberumanAPI managing: CHAI + REST', function () {
    it('should return an Hola Mundo message', function(done){
        chai.request(url)
            .get("/")
            .end(function(err, res){
                expect(res).to.have.status(httpCodes.codes.OK);
                assert.equal(res.text,'Hola Mundo');
                done();
            });
    });
});
