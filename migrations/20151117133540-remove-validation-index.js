'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Validations', 'ValidationIndex')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Validations', [
        'validation_public_key',
        'ledger_hash',
        'reporter_public_key'
      ], {
        indexName: 'ValidationIndex',
        indicesType: 'UNIQUE'
      });
  }
};
