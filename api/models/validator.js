'use strict';
module.exports = function(sequelize, DataTypes) {
  var Validator = sequelize.define('Validators', {
    validation_public_key: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    domain: {
      type     : DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Validator;
};
