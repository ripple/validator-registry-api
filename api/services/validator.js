'use strict';
module.exports = function(sequelize, DataTypes) {
  var Validator = sequelize.define('Validator', {
    validation_public_key: DataTypes.STRING,
    domain: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Validator;
};