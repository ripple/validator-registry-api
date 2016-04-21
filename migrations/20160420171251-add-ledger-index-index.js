'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.addIndex('Validations', ['ledger_index'])
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Validations', ['ledger_index'])
  }
};
