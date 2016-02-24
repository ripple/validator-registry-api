'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Manifests', [
        'ephemeral_public_key',
        'master_public_key',
        'sequence',
        'signature'
      ], {
        indexName: 'ManifestIndex',
        indicesType: 'UNIQUE'
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Manifests', 'ManifestIndex')
  }
};
