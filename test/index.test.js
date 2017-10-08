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

      Test.once('create', function (data) {
        expect(data.text).to.equal('1234');
        expect(data).to.be.an('object');
        done();
      });

      testDoc.save()
        .then((data) => data)
        .catch((err) => console.error('Error saving: ', err))
    });
  });

  describe('#update', () => {
    it('should emit update:<key> event', function (done) {
      var testDoc = new Test({
        text: 'updated'
      });

      testDoc.save()
        .then((doc) => {
          const updated = {
            text: 'updated'
          };

          Test.once('update', (data) => {
            expect(data).to.be.an('object');
            expect(data.text).to.equal('1234');
          });

          Test.once('update:text', (data) => {
            expect(data).to.be.an('object');
            expect(data.text).to.equal('1234');
            done();
          });

          Test.findOne({ text: 'updated' })
            .then((doc) => {
              doc.text = '1234'
              doc.save()
            })
            .catch(err => console.error('Error'));
        });
    });
  });

  describe('#delete', () => {
    it('should emit deleted event', (done) => {
      const deletedDoc = new Test({
        text: 'deleted'
      });

      deletedDoc.save()
        .then((doc) => {
          Test.on('delete', (data) => {
            expect(data.text).to.equal('deleted');
            expect(data).to.be.an('object');
            done();
          });

          Test.findOne({ _id: doc._id })
            .then((doc) => doc.remove());
        });
    });
  });
});

