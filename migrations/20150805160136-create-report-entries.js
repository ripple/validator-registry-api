'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ReportEntries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      validation_public_key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      validations: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      agreement_validations: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      disagreement_validations: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      agreement_coefficient: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      disagreement_coefficient: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Reports",
          key: "id"
        }
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
    return queryInterface.dropTable('ReportEntries');
  }
};