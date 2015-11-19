'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Validations', [
        'validation_public_key',
        'ledger_hash'
      ], {
        indexName: 'ValidationIndex',
        indicesType: 'UNIQUE'
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Validations', 'ValidationIndex')
  }
};
