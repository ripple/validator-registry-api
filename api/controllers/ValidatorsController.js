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

    // Return validators with their most recent domain status
    let verifications = await database.Verifications.findAll({
      order: [['"createdAt"', 'DESC']]
    })
    let validators = []
    let validation_public_keys = []
    for (let verification of verifications) {
      if (!(_.contains(validation_public_keys,
                       verification.validation_public_key))) {
        validators.push({
          validation_public_key: verification.validation_public_key,
          domain: verification.domain,
          error: verification.error
        })
        validation_public_keys.push(verification.validation_public_key)
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

