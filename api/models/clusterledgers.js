'use strict';
module.exports = function(sequelize, DataTypes) {
  var ClusterLedgers = sequelize.define('ClusterLedgers', {
    ledger_hash: {
      type     : DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /[A-F0-9]{64}/,
          msg: 'Invalid ledger_hash'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ClusterLedgers;
};
