/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `ReportsController.indexByValidator()`
   *
   * @api {get} /validators/:validation_public_key/reports Historical Reports for a Validator
   * @apiName historicalReports
   * @apiGroup Reports
   *
   * @apiParam {ValidationPublicKey} validation_public_key ripple validation public key
   *
   * @apiSuccess {Array} reports Array of Report objects with date, validations properties
   * @apiSuccess {Date} report.date date of report formatted as YYYY-MM-DD
   * @apiSuccess {Array} report.cluster Array of Ripple validation public keys used for agreement benchmark
   * @apiSuccess {Date} report.quorum number of validation from cluster for consensus
   * @apiSuccess {Array} report.entries Array of report entry objects with validator properties
   * @apiSuccess {ValidationPublicKey} entry.validation_public_key ripple validation public key
   * @apiSuccess {Integer} report.entry.validations total number of validations
   * @apiSuccess {Integer} report.entry.agreement_validations total number of validations validated by cluster
   * @apiSuccess {Integer} report.entry.disagreement_validations total number of validations not validated by cluster
   * @apiSuccess {Float} report.entry.agreement_coefficient percentage of cluster validations validated by validator
   * @apiSuccess {Float} report.entry.disagreement_coefficient percentage of validator validations not validated by cluster
  */
  indexByValidator: async function (req, res) {

    try {
      const key = req.params.validation_public_key

      const reports = await database.Reports.findAll({
        attributes: [
          'date',
          'quorum',
          'cluster',
          'cluster_validations'
        ],
        order: 'date DESC',
        include: [{
          model: database.ReportEntries,
          as: 'entries',
          attributes: [
            'validation_public_key',
            'validations',
            'agreement_validations',
            'disagreement_validations',
            'agreement_coefficient',
            'disagreement_coefficient'
          ],
          where: {
            validation_public_key: key
          }
        }]
      })
      return res.status(200).json({
        reports: reports
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  },

  /**
   * `ReportsController.show()`
   *
   * @api {get} /reports/:date Report for all validators from specified date
   * @apiName report
   * @apiGroup Reports
   *
   * @apiParam {Date} date date of report formatted as YYYY-MM-DD
   *
   * @apiSuccess {Date} date date of report formatted as YYYY-MM-DD
   * @apiSuccess {Array} cluster Array of Ripple validation public keys used for agreement benchmark
   * @apiSuccess {Date} quorum number of validation from cluster for consensus
   * @apiSuccess {Array} entries Array of report entry objects with validator properties
   * @apiSuccess {ValidationPublicKey} entry.validation_public_key ripple validation public key
   * @apiSuccess {Integer} entry.validations total number of validations
   * @apiSuccess {Integer} entry.agreement_validations total number of validations validated by cluster
   * @apiSuccess {Integer} entry.disagreement_validations total number of validations not validated by cluster
   * @apiSuccess {Float} entry.agreement_coefficient percentage of cluster validations validated by validator
   * @apiSuccess {Float} entry.disagreement_coefficient percentage of validator validations not validated by cluster
  */
  show: async function (req, res) {

    try {
      const date = req.params.date

      const report = await database.Reports.findOne({
        attributes: [
          'date',
          'quorum',
          'cluster',
          'cluster_validations'
        ],
        where: {
          date: date
        },
        include: [{
          model: database.ReportEntries,
          as: 'entries',
          attributes: [
            'validation_public_key',
            'validations',
            'agreement_validations',
            'disagreement_validations',
            'agreement_coefficient',
            'disagreement_coefficient'
          ]
        }]
      })
      return res.status(200).json({
        report: report
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  }
};
