/**
 * ValidationsController
 *
 * @description :: Server-side logic for managing validations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `ValidationsController.indexByValidator()`
   */
  indexByValidator: function (req, res) {

    database.Validations.findAll({
      where: {
        validation_public_key: req.params.validation_public_key
      }
    })
    .then(validations => {
      return res.json({
        validations: validations
      })
    })
  },

  /**
   * `ValidationsController.indexByLedger()`
   */
  indexByLedger: function (req, res) {

    database.Validations.findAll({
      where: {
        ledger_hash: req.params.ledger_hash
      }
    })
    .then(validations => {
      return res.json({
        validations: validations
      })
    })
  }
};

