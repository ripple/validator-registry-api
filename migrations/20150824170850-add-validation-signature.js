'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Validations',
      'signature',
      Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface('Validations', 'signature');
  }
};
