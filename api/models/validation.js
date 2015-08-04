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
    createdAt: {
      type     : DataTypes.DATE
    },
  }, {
    classMethods: {
      countByValidatorInLast24Hours: function() {
        return sequelize.query(
          'select sum(1), validation_public_key from "Validations" where "createdAt" > ? group by validation_public_key'
        ,{
          replacements: [moment().subtract(1, 'days').toDate()],
          type: sequelize.QueryTypes.SELECT
        }).then(results => {
          return results.map(result => {
            return {
              validations_count: parseInt(result.sum),
              validation_public_key: result.validation_public_key
            }
          })
        })
      },

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
