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
  index: async function (req, res) {

    let validators = await database.Validations.getValidators()
    for (let i=0; i<validators.length; i++) {
      let verification = await database.Verifications.getVerificationStatus(validators[i])
      validators[i] = {
        validation_public_key: validators[i],
        domain: verification.domain,
        error: verification.error
      }
    }
    return res.json({
      validators: validators
    })
  },


  /**
   * `ValidatorsController.show()`
   */
  show: async function (req, res) {

    let verification = await database.Verifications.getVerificationStatus(req.params.validation_public_key)
    return res.json({
      validator: verification ? {
        validation_public_key: req.params.validation_public_key,
        domain: verification.domain,
        error: verification.error
      } : {}
    })
  },
};

