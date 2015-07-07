/**
 * ValidationsController
 *
 * @description :: Server-side logic for managing validations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var db = require('../services/database');

module.exports = {
	


  /**
   * `ValidationsController.create()`
   */
  create: function (req, res) {
    var validation_public_key = req.param('validation_public_key')
    var ledger_hash = req.param('ledger_hash')
    var reporter_public_key = req.param('reporter_public_key')

    if (!validation_public_key || !ledger_hash || !reporter_public_key) {
      return res.status(400).json({
        message: "Requires 'validation_public_key', 'ledger_hash', and 'reporter_public_key'"
      })
    }

    res.status(200).send('OK')

    return db.Validations.create({
      validation_public_key: validation_public_key,
      ledger_hash: ledger_hash,
      reporter_public_key: reporter_public_key
    })
    .catch(function(err) {
      console.error(err)
    })
  },


  /**
   * `ValidationsController.index()`
   */
  index: function (req, res) {
    var validation_public_key = req.params.validation_public_key

    if (!validation_public_key) {
      return res.status(400).json({
        message: "Requires 'validation_public_key'"
      })
    }

    database.Validations.findAll({
      where: {
        validation_public_key: validation_public_key
      }
    })
    .then(validations => {
      return res.json({
        validations: validations
      })
    })
  },


  /**
   * `ValidationsController.show()`
   */
  show: function (req, res) {
    var ledger_hash = req.params.ledger_hash

    if (!ledger_hash) {
      return res.status(400).json({
        message: "Requires 'ledger_hash'"
      })
    }

    database.Validations.findAll({
      where: {
        ledger_hash: ledger_hash
      }
    })
    .then(validations => {
      return res.json({
        validations: validations
      })
    })
  }
};

