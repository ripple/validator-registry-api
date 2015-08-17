'use strict';
module.exports = function(sequelize, DataTypes) {
  var ReportEntries = sequelize.define('ReportEntries', {
    validation_public_key: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i,
          msg: 'Invalid validation_public_key'
        }
      }
    },
    validations: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agreement_validations: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    disagreement_validations: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agreement_coefficient: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 1
      }
    },
    disagreement_coefficient: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 1
      }
    },
    report_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    validate: {
      validationCounts: function() {
        if (this.agreement_validations + this.disagreement_validations !== this.validations) {
          throw new Error('validations should be the sum of agreement_validations and disagreement_validations')
        }
      },
      agreementCoefficient: async function() {
        const report = await this.getReport()
        if (report && this.agreement_validations / report.cluster_validations !== this.agreement_coefficient) {
          throw new Error('agreement_coefficient should equal agreement_validations / cluster_validations')
        }
      },
      divergenceCoefficient: async function() {
        if (this.disagreement_validations / this.validations !== this.disagreement_coefficient) {
          throw new Error('disagreement_coefficient should be disagreement_validations / validations')
        }
      },
      uniqueValidationPublicKeyPerReport: async function() {
        if (await ReportEntries.findOne({
          where: {
            validation_public_key: this.validation_public_key,
            report_id: this.report_id
          }
        })) {
          throw new Error('One validation public key entry per report_id')
        }
      }
    },
    classMethods: {
      associate: function(models) {
        ReportEntries.belongsTo(models.Reports, {foreignKey: 'report_id'})
      }
    }
  });
  return ReportEntries;
};
