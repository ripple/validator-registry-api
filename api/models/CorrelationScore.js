'use strict';

const validationPublicKeyRegex = /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i

module.exports = (sequelize, DataTypes) => {
  const CorrelationScores = sequelize.define('CorrelationScores', {
    cluster: {
      type     : DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        areValidationPublicKeys: (cluster) => {
          cluster.forEach(validationPublicKey => {
            if (!validationPublicKey.match(validationPublicKeyRegex)) {
              throw new Error('only ripple validation public keys allowed')
            }
          })
        }
      }
    },
    coefficients: {
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
    },
    quorum: {
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
    getterMethods: {
      coefficients: function() {
        var coefficients = this.getDataValue('coefficients')
        Object.keys(coefficients).forEach(publicKey => {
          coefficients[publicKey].correlation = parseFloat(coefficients[publicKey].correlation)
        })
        return coefficients
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return CorrelationScores;
};
