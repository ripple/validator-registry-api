'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.addIndex('Validations', ['createdAt'])
    .then(function() {
      return queryInterface.addIndex('Validations', ['ledger_hash'])
    })
    .then(function() {
      return queryInterface.addIndex('Validations', ['validation_public_key'])
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Validations', ['createdAt'])
    .then(function() {
      return queryInterface.removeIndex('Validations', ['ledger_hash'])
    })
    .then(function() {
      return queryInterface.removeIndex('Validations', ['validation_public_key'])
    })
  }
};
