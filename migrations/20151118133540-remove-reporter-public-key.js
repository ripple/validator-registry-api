'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Validations', 'reporter_public_key');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Validations',
      'reporter_public_key',
      {
        allowNull: false,
        type: Sequelize.STRING
      }
    );
  }
};
