'use strict';

const validationPublicKeyRegex = /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i

module.exports = (sequelize, DataTypes) => {
  const Clusters = sequelize.define('Clusters', {
    validation_public_keys: {
      type     : DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        areValidationPublicKeys: (validation_public_keys) => {
          validation_public_keys.forEach(validationPublicKey => {
            if (!validationPublicKey.match(validationPublicKeyRegex)) {
              throw new Error('Invalid validation_public_key')
            }
          })
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
  return Clusters;
};
