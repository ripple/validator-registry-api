'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Manifests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ephemeral_public_key: {
        allowNull: false,
        type: Sequelize.STRING
      },
      master_public_key: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sequence: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      signature: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Manifests');
  }
};