/**
 * LedgersController
 *
 * @description :: Server-side logic for managing Ledgers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `LedgersController.show()`
   *
   * @api {get} /ledgers/:ledger_hash/validations List of Validations by Ledger
   * @apiName ledgerValidations
   * @apiGroup Ledgers
   *
   * @apiSuccess {Array} validations Array of validations with the given ledger hash
   * @apiSuccess {String} ledger_hash ledger hash from request parameters
   * @apiSuccess {String} validation.validation_public_key public key that signed the validation
   * @apiSuccess {Date} valdation.createdAt Date when validation was reported to the registry
  */

  show: function (req, res) {

    database.sequelize.query(`SELECT DISTINCT on (validation_public_key) validation_public_key, ledger_hash, "createdAt" from "Validations" where ledger_hash = '${req.params.ledger_hash}'`)
      .spread(validations => {
        if (validations.length > 0) {
          return res.status(200).send({
            ledger_hash: req.params.ledger_hash,
            validations: validations
          })
        } else {
          return res.status(400).send({
            ledger_hash: req.params.ledger_hash,
            error: 'ledger not found'
          })
        }
      })
  }
};

