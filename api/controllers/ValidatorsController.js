/**
 * ValidatorsController
 *
 * @description :: Server-side logic for managing validators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `ValidatorsController.index()`
   */
  index: function (req, res) {

    database.Validators.findAll().then(validators => {
      return res.json({
        validators: validators.map(v => v.toJSON())
      })
    })
  },


  /**
   * `ValidatorsController.show()`
   */
  show: function (req, res) {

    database.Validators.findOne({
      validation_public_key: req.params.validation_public_key
    })
    .then(validator => {
      return res.json({
        validator: validator.toJSON()
      })
    })
  },


  /**
   * `ValidatorsController.payouts()`
   */
  payouts: function (req, res) {
    return res.json({
      todo: 'payouts() is not implemented yet!'
    });
  }
};

