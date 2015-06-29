'use strict';
module.exports = function(sequelize, DataTypes) {
  var Validation = sequelize.define('Validation', {
    validation_public_key: DataTypes.STRING,
    ledger_hash: DataTypes.STRING,
    reporter_public_key: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Validation;
};