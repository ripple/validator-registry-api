'use strict';

const validationPublicKeyRegex = /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i

module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define('Reports', {
    cluster: {
      type     : DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        areValidationPublicKeys: (cluster) => {
          cluster.forEach(validationPublicKey => {
            if (!validationPublicKey.match(validationPublicKeyRegex)) {
              throw new Error('Invalid validation_public_key')
            }
          })
        }
      }
    },
    date: {
      type     : DataTypes.STRING,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'date must be formatted as YYYY-MM-DD'
        }
      }
    },
    quorum: {
      type     : DataTypes.INTEGER,
      allowNull: false
    },
    cluster_validations: {
      type     : DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    validate: {
      quorumIsLessThanOrEqualToClusterSize: function() {
        if (!this.cluster) {
          return
        }
        if (parseInt(this.quorum) > this.cluster.length) {
          throw new Error('quorum cannot be greater than cluster size')
        }
      }
    },
    classMethods: {
      associate: function(models) {
        Reports.hasMany(models.ReportEntries, {foreignKey: 'report_id', as: 'entries'})
      }
    }
  });
  return Reports;
};
