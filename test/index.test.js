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
const assert = require('assert');

chai.use(spies);

before((done) => {
  mongoose.connect('localhost:27017/__mongoose-fire__test__001')
    .then((connection) => {
      done();
    });
});

beforeEach(function () {
  Test.find({}).remove().exec();
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
      const testDoc = new Test({
        text: '1234'
      });

      Test.on('create', function (data) {
        expect(data.text).to.equal('1234');
        expect(data).to.be.an('object');
        done();
      });

      const spy = sinon.spy(Test, 'on');

      testDoc.save()
        .then((data) => data)
        .catch((err) => console.error('Error saving: ', err))
    });
  });

  describe('#update', () => {
    it('should emit updated event', function (done) {
      var testDoc = new Test({ text: 'update' })
      var called = sinon.spy();

      Test.on('update', (updated) => {
        called();
        console.log('updated', updated);
        expect(updated).to.be.an('object');
      });

      testDoc.save().then((data) => data);

      Test
        .update({ text: 'update' },
          {$set: { text: 'this is updated now' }},
          function(err, doc) {
            if (err) console.error('Error updating: ', err);
            console.log('this was changed', doc);
          });

      expect(called.callCount).to.equal(1);
      done();
    });

    it('should emit update:<key> event', function () {

    });
  });
});

