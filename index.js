"use strict";

const _ = require('underscore');
const socket = require('socket.io');

module.exports = exports = function mongooseFire (schema, options) {
  let model;

  options = options || {};
  console.log('options: ', options);

  schema.pre('find', function () {
    console.log('find this: ', this);
    model = this.model(this.constructor.modelName);
  });

  schema.pre('findOne', function () {
    console.log('findOne this: ', this);
    model = this.model(this.constructor.modelName);
  });

  schema.post('find', function () {
    model = this.model(this.constructor.modelName);
    console.log('find this: ', this);
    model.emit('find', this, Date.now());
  });

  schema.post('findOne', function () {
    model = this.model(this.constructor.modelName);
    console.log('findOne this: ', this);
    model.emit('findOne', this, Date.now());
  });

  schema.pre('save', function () {
    model = this.model(this.constructor.modelName);
    model.emit('presave', this);

    this._changed = this.modifiedPaths();
    this._isNew = this.isNew;
    this._lastUpdated = Date.now();
  });

  schema.post('save', function (next) {
    model = this.model(this.constructor.modelName);

    console.log('GOT HERE');

    if(this._changed) {
      model.emit('update', this);

      let self = this;
      let eventKeys = {};

      console.log('update:', this._changed, Date.now());

      _.each(this._changed, (attr) => {
        let key = `update:${attr}`
        if (typeof eventKeys[key] === 'undefined') {
          model.emit(key, self);
          eventKeys[key] = key;
        }
      });

      delete this._changed;
    }

    if (this._isNew) {
      model.emit('create', this, Date.now());
      delete this._isNew;
    }

    console.log('final object: ', this);
    console.log('next: ', next);
  });

  schema.post('remove', function () {
    model.emit('delete', this, Date.now());
  });
}
