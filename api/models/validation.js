'use strict';
import moment from 'moment'

module.exports = function(sequelize, DataTypes) {
  var Validation = sequelize.define('Validations', {
    validation_public_key: {
      type     : DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i,
          msg: 'Invalid validation_public_key'
        }
      }
    },
    ledger_hash: {
      type     : DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /[A-F0-9]{64}/,
          msg: 'Invalid ledger_hash'
        }
      }
    },
    reporter_public_key: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    signature: {
      type     : DataTypes.STRING
    },
    createdAt: {
      type     : DataTypes.DATE
    },
  }, {
    classMethods: {
      getValidators: function() {
        return sequelize.query(
          'select validation_public_key from "Validations" group by validation_public_key;'
        ,{
          type: sequelize.QueryTypes.SELECT
        }).then(results => {

          return results.map(result => {
            return result.validation_public_key
          })
        })
      },
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Validation;
};
