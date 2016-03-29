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

  /**
   * @api {get} /ledgers/{:ledger_hash/ledger_index}/validations Validations by ledger
   * @apiName ledgerValidations
   * @apiGroup Validations
   *
   * @apiParam {String} ledger_hash ledger hash
   * @apiParam {Number} ledger_index ledger sequence number
   *
   * @apiSuccess {Array} validations Array of validation objects with validation properties
   * @apiSuccess {ValidationPublicKey} validations.validation_public_key ripple validation public key
   * @apiSuccess {String} validation.ledger_hash hash of validated ledger
   */
  indexByLedger: async function (req, res) {

    try {
      let validations
      if (req.params.ledger.match(/[A-F0-9]{64}/)) {
        validations = await database.Validations.findAll({
          attributes: [
            'validation_public_key',
            'ledger_hash'
          ],
          where: {
            ledger_hash: req.params.ledger
          },
          raw: true
        })
      } else {
        validations = await database.Validations.findAll({
          attributes: [
            'validation_public_key',
            'ledger_hash'
          ],
          where: {
            ledger_index: req.params.ledger
          },
          raw: true
        })
      }

      return res.json({
        validations: validations
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  }
};
