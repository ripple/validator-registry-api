'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('Reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      cluster: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quorum: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cluster_validations: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('CorrelationScores');
  }
};
