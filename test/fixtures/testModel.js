"use strict";

const mongoose = require('mongoose');

const Test = new mongoose.Schema({
  text: {
    type: String
  }
});

Test.plugin(require('../../'));

const testModel = mongoose.model('test', Test);

module.exports = testModel;
