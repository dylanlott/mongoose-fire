"use strict";

const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const sinon = require('sinon');
const spies = require('chai-spies');
const Test = require('./fixtures/testModel.js');
const EventEmitter = require('events').EventEmitter;
const socket = require('socket.io');

chai.use(spies);


before((done) => {
  mongoose.connect('localhost:27017/__mongoose-fire__test__001')
    .then((connection) => {
      done();
    });
});

beforeEach(function () {
  Test.find({}).remove();
});

describe('mongoose-fire', () => {
  it('should setup correctly and connect to mongoose', () => {
    expect(mongoose.connection.readyState).to.equal(1);
  });

  it('should have event emitters', (done) => {
    expect(Test.emit).to.be.a('function');
    done();
  });

  describe('#create', () => {
    it('should emit create event', (done) => {
      var callback = sinon.spy();

      Test.on('created', (data) => {
        callback();
        console.log('data emitted: ', data);
      });

      const doc = new Test({text: 'create event test'});
      doc.save();

      expect(callback.callCount).to.equal(1);
      done();
    });
  });

});

