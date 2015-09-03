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
};

