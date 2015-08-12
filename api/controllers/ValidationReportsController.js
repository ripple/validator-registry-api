/**
 * ValidationReportsController
 *
 * @description :: Server-side logic for managing Validationreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `ValidationReportsController.index()`
   */
  /**
   * @api {get} /reports Latest Report for all Validators
   * @apiName latestReport
   * @apiGroup Reports
   *
   * @apiSuccess {Date} date date of report formatted as YYYY-MM-DD 
   * @apiSuccess {Json} validators map of public keys with validator-specific data
   * @apiSuccess {Integer} validators.validations total validations for the validator
   * @apiSuccess {Integer} validators.correlation_coefficient correlation score for the validator
   * @apiSuccess {Integer} validators.divergence_coefficient divergence score for the validator
   */
  index: function (req, res) {

    ValidationReportService.latest().then(report => {
  
      return res.status(200).json({
        report: report
      })
    })
    .catch(error => {
      res.status(500).json({
        error: error.message
      })
    })
  },

  /**
   * `ValidationReportsController.show()`
   *
   * @api {get} /reports/:validation_public_key Historical Reports for a Validator
   * @apiName historicalReports
   * @apiGroup Reports
   *
   * @apiSuccess {ValidationPublicKey} validation_public_key Ripple validation public key
   * @apiSuccess {Array} reports Array of Report objects with date, validations properties
   * @apiSuccess {Date} report.date date of report formatted as YYYY-MM-DD
   * @apiSuccess {Integer} report.validations total number of validations
   * @apiSuccess {Integer} report.correlation_coefficient percentage of cluster validations validated by validator
   * @apiSuccess {Integer} report.divergence_coefficient percentage of validator validations not validated by cluster
  */

  show: function (req, res) {

    let key = req.params.validation_public_key

    ValidationReportService.historyForValidator(key).then(reports => {

      return res.status(200).json({
        validation_public_key: key,
        reports: reports
      })
    })
    .catch(error => {
      res.status(500).json({
        error: error.message
      })
    })
  }
};

