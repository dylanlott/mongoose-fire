"use strict";

module.exports = function (schema, options) {
  console.log('schema registered: ', schema);
  console.log('options: ', options);

  schema.pre('save', function(next) {
    console.log('pre schema save', next);
    next();
  });
}
