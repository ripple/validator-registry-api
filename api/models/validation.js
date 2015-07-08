'use strict';
module.exports = function(sequelize, DataTypes) {
  var Validation = sequelize.define('Validations', {
    validation_public_key: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    ledger_hash: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    reporter_public_key: {
      type     : DataTypes.STRING,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Validation;
};
