/**
 * ValidationsController
 *
 * @description :: Server-side logic for managing validations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Checkit = require('checkit')

const validationCheckit = new Checkit({
  validation_public_key: 'required',
  ledger_hash: 'required',
  reporter_public_key: 'required',
})

module.exports = {

  /**
   * `ValidationsController.create()`
   */
  create: function (req, res) {

    validationCheckit.run(req.body)
    .then(() => {
      res.status(200).send('OK')

      database.Validations.create({
        validation_public_key: req.body.validation_public_key,
        ledger_hash: req.body.ledger_hash,
        reporter_public_key: req.body.reporter_public_key
      })
    })
    .catch(error => {
      res.status(400).json(error)
    })
  },


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
   * `ValidationsController.inReportsdex()`
   */

  /**
   * @api {get} /validations 
   * @apiName listValidations
   * @apiGroup Validations
   *
   * @apiSuccess {Integer} validations_count total validations for validator in past 24 hours
   * @apiSuccess {ValidationPublicKey} validation_public_key rippled validation public key
  */

  index: function (req, res) {

    database.Validations.countByValidatorInLast24Hours() 
      .then(validations => { 
        res.status(200).json({ 
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

