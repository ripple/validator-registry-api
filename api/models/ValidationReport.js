'use strict';

const validationPublicKeyRegex = /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i

module.exports = (sequelize, DataTypes) => {
  const ValidationReports = sequelize.define('ValidationReports', {
    validators: {
      type     : DataTypes.JSON,
      allowNull: false
    },
    date: {
      type     : DataTypes.STRING,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'date must be formatted as YYYY-MM-DD'
        }
      }
    }
  }, {
    getterMethods: {
      validators: function() {
        var validators = this.getDataValue('validators')
        Object.keys(validators).forEach(publicKey => {
          validators[publicKey] = parseInt(validators[publicKey])
        })
        return validators
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ValidationReports;
};
