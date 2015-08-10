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
   * @apiSuccess {Json} validators public keys mapped to data report data by validator
   * @apiSuccess {Date} date date of report formatted as YYYY-MM-DD 
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

