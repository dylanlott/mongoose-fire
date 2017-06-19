"use strict";

const _ = require('underscore');
const socket = require('socket.io');

module.exports = exports = function mongooseFire (schema, options) {

  options = options || {};

  schema
    .pre('save', function (next) {
      var model = this.model(this.constructor.modelName);
      model.emit('presave', this);

      this._changed = this.modifiedPaths();
      this._isNew = this.isNew;
      this._lastUpdated = Date.now();

      next();
    })

    .post('save', function (next) {
      var model = this.model(this.constructor.modelName);

      if(this._changed) {
        console.log('this changed', this._changed);
        model.emit('update', this);

        let self = this;
        let eventKeys = {};

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

      next();
    })

    .post('remove', function (next) {
      var model = this.model(this.constructor.modelName);
      model.emit('delete', this, Date.now());
      next();
    });
}
