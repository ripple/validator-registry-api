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

