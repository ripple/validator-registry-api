'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Validations',
      'ledger_index',
      Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface('Validations', 'ledger_index');
  }
};
