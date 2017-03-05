/**
 * Created by haniya on 3/6/2017.
 */


var assert = require('assert');
var supertest = require("supertest");
var expect = require("chai").expect;
var testConfig = require('../testdata/testConfig');

var server = "http://" + testConfig.application_server.host + ":" + testConfig.application_server.port;

var staticInfo = require('../testdata/staticInfoTestData');
var dynamicInfo = require('../testdata/dynamicInfoTestData');
describe('Fetch Static Data from remote api', function() {
    var url =  "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"+testConfig.testUser.id;
    this.timeout(15000);
    supertest(server)
        .get(url)
        .send({static:staticInfo})
        .end(function (err, res) {
            expect(err).to.be.equals(null);
            expect(res.body).to.have.property('last_updated').not.to.be.equals(0);
            expect(res.body).to.have.property('data');

            done();
        });
});

describe('Fetch Dynamic Data from remote api', function() {
    var url =  "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"+testConfig.testUser.id;
    this.timeout(15000);
    supertest(server)
        .get(url)
        .send({static:dynamicInfo})
        .end(function (err, res) {
            expect(err).to.be.equals(null);
            expect(res.body).to.have.property('last_updated').not.to.be.equals(0);
            expect(res.body).to.have.property('data');

            done();
        });
});
